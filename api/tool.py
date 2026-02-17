import json
import subprocess
import time
import httpx
from pathlib import Path

# Configuration
DB_CONTAINER = "liella_postgres"
API_URL = "http://localhost:8000/api/v1"
BACKUP_FILE = "rankings_raw_backup.json"

def run_db_query(sql, fetch=True):
    """Executes a SQL command inside the Docker container."""
    flag = "-t -A" if fetch else ""
    cmd = f"docker exec {DB_CONTAINER} psql -U liella_user -d liella_rankings {flag} -c \"{sql}\""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ SQL Error: {result.stderr}")
    return result.stdout.strip()

def print_database_snapshot(label="Current"):
    """Displays a summary of the database state for verification."""
    print(f"\n--- 📊 Database Snapshot: {label} ---")
    
    # Check Counts
    f_count = run_db_query("SELECT count(*) FROM franchises;")
    s_count = run_db_query("SELECT count(*) FROM songs;")
    sg_count = run_db_query("SELECT count(*) FROM subgroups;")
    sub_count = run_db_query("SELECT count(*) FROM submissions;")
    
    # Process franchise names outside f-string to avoid backslash syntax error
    f_names_raw = run_db_query("SELECT name FROM franchises ORDER BY name;")
    f_names_list = f_names_raw.splitlines()
    f_names_formatted = ", ".join(f_names_list)
    
    print(f"   Franchises: {f_count} ({f_names_formatted})")
    print(f"   Songs:      {s_count}")
    print(f"   Subgroups:  {sg_count}")
    print(f"   User Ranks: {sub_count}")
    print("-" * 35 + "\n")

def backup():
    print("📦 Phase 1: Backing up valid user rankings...")
    sql = """
    SELECT json_build_object(
        'username', s.username,
        'franchise', f.name,
        'subgroup_name', 'All Songs',
        'ranking_list', s.raw_ranking_text
    )
    FROM submissions s
    JOIN franchises f ON s.franchise_id = f.id
    WHERE s.submission_status::text IN ('valid', 'VALID');
    """
    raw_output = run_db_query(sql)
    
    if not raw_output:
        print("⚠️  No valid rankings found to backup. Proceeding with metadata update only.")
        return []
        
    backup_data = [json.loads(line) for line in raw_output.split('\n') if line.strip()]
    with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
        json.dump(backup_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Backup saved to {BACKUP_FILE} ({len(backup_data)} users)")
    return backup_data

def wipe_and_reseed():
    print("🧨 Phase 2: Wiping data and Aligning Schema...")
    
    # 1. FIX THE ENUM (Schema Alignment)
    # This prevents the "invalid input value for enum" error
    # We use 'IF NOT EXISTS' if your Postgres version supports it, 
    # otherwise we wrap it in a try-style logic.
    fix_enum_sql = "ALTER TYPE submissionstatus ADD VALUE IF NOT EXISTS 'INCOMPLETE';"
    run_db_query(fix_enum_sql, fetch=False)
    
    # 2. Clear Tables
    sql = "TRUNCATE TABLE analysis_results, submissions, subgroups, songs CASCADE;"
    run_db_query(sql, fetch=False)
    
    # 3. Trigger Reseed
    print("♻️  Restarting API to trigger metadata seed...")
    subprocess.run("docker-compose restart api", shell=True)
    
    print("⏳ Waiting for API to re-populate...")
    api_ready = False
    for i in range(15):
        try:
            r = httpx.get(f"{API_URL}/health", timeout=2.0)
            if r.status_code == 200:
                api_ready = True
                break
        except:
            pass
        time.sleep(2.0)
        print(f"   Polling Backend (Attempt {i+1}/15)...", end="\r")

    if not api_ready:
        print("\n❌ API failed to come online.")
        return False

    print("\n✅ API Online. Schema aligned and metadata seeded.")
    return True

def restore():
    print("🚀 Phase 3: Restoring rankings...")
    if not Path(BACKUP_FILE).exists():
        print("⏭️  Skip: Backup missing.")
        return

    with open(BACKUP_FILE, 'r', encoding='utf-8') as f:
        rankings = json.load(f)

    success = 0
    with httpx.Client(timeout=60.0) as client:
        for entry in rankings:
            entry['missing_song_handling'] = 'end'
            
            print(f"   Restoring {entry['username']}...", end="\r")
            try:
                resp = client.post(f"{API_URL}/submit", json=entry)
                
                # Check status inside the 200 OK response
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get('status') in ['VALID', 'CONFLICTED']:
                        success += 1
                        if data.get('status') == 'CONFLICTED':
                            print(f"\n⚠️  {entry['username']} restored with CONFLICTS (metadata mismatch)")
                    else:
                        print(f"\n❌ {entry['username']} returned unexpected status: {data.get('status')}")
                else:
                    # IMPROVED ERROR REPORTING
                    try:
                        error_detail = resp.json()
                        print(f"\n❌ Error {entry['username']} ({resp.status_code}): {json.dumps(error_detail)}")
                    except:
                        print(f"\n❌ Error {entry['username']} ({resp.status_code}): {resp.text[:100]}")

            except Exception as e:
                print(f"\n❌ Connection Failure for {entry['username']}: {str(e)}")

    print(f"\n✨ Restore Finished. {success}/{len(rankings)} users restored.")
    print_database_snapshot("Final State")
    
    print("⚙️  Triggering analysis recomputation...")
    try: client.post(f"{API_URL}/analysis/trigger")
    except: pass

if __name__ == "__main__":
    import sys
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"
    
    print_database_snapshot("Pre-Migration")

    if cmd in ["backup", "all"]: 
        backup()
    if cmd in ["wipe", "all"]: 
        if not wipe_and_reseed():
            sys.exit(1)
    if cmd in ["restore", "all"]: 
        restore()