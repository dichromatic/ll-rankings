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
    
    # Check Franchises Exist
    f_names = run_db_query("SELECT name FROM franchises ORDER BY name;")
    
    print(f"   Franchises: {f_count} ({f_names.replace('\\n', ', ')})")
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
    print("🧨 Phase 2: Clearing existing data...")
    sql = "TRUNCATE TABLE analysis_results, submissions, subgroups, songs CASCADE;"
    run_db_query(sql, fetch=False)
    
    print("♻️  Restarting API to trigger fresh metadata seed...")
    subprocess.run("docker-compose restart api", shell=True)
    
    # Active Polling: Wait for API to be ready
    print("⏳ Waiting for API health check...")
    api_ready = False
    for i in range(20):
        try:
            r = httpx.get(f"{API_URL}/health")
            if r.status_code == 200:
                api_ready = True
                break
        except:
            pass
        time.sleep(1.5)
        print(f"   Attempt {i+1}/20...", end="\r")

    if not api_ready:
        print("\n❌ API failed to start in time. Check Docker logs.")
        return False

    print("\n✅ API is Online.")
    
    # Verification Step
    print_database_snapshot("Post-Reseed Verification")
    
    # Verify Ikizuraibu specifically
    ikiz_check = run_db_query("SELECT count(*) FROM franchises WHERE name = 'ikizuraibu';")
    if ik_count := int(ikiz_check) > 0:
        print("✅ Success: 'ikizuraibu' franchise detected in database.")
    else:
        print("⚠️  Warning: 'ikizuraibu' not found. Check if seed_franchises in init.py was updated.")
    
    return True

def restore():
    print("🚀 Phase 3: Re-submitting rankings through the live logic...")
    if not Path(BACKUP_FILE).exists():
        print("⏭️  No backup file to restore.")
        return

    with open(BACKUP_FILE, 'r', encoding='utf-8') as f:
        rankings = json.load(f)

    success = 0
    with httpx.Client(timeout=60.0) as client:
        for entry in rankings:
            entry['missing_song_handling'] = 'end'
            
            print(f"   Importing {entry['username']} ({entry['franchise']})...", end="\r")
            try:
                resp = client.post(f"{API_URL}/submit", json=entry)
                if resp.status_code == 200:
                    success += 1
                else:
                    print(f"\n❌ Error {entry['username']}: {resp.json().get('detail', resp.text)}")
            except Exception as e:
                print(f"\n❌ Connection error for {entry['username']}: {e}")

    print(f"\n✨ Restoration finished. {success}/{len(rankings)} users re-ranked.")
    
    # Verify final counts
    print_database_snapshot("Final State")
    
    print("⚙️  Triggering global analysis recomputation...")
    client.post(f"{API_URL}/analysis/trigger")

if __name__ == "__main__":
    import sys
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"
    
    # Initial State
    print_database_snapshot("Pre-Migration")

    if cmd == "backup" or cmd == "all": 
        backup()
    if cmd == "wipe" or cmd == "all": 
        if not wipe_and_reseed():
            sys.exit(1)
    if cmd == "restore" or cmd == "all": 
        restore()