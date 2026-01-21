import json
from pathlib import Path

# Configuration
DATA_DIR = Path(__file__).parent
OUTPUT_DIR = Path(__file__).parent

FRANCHISE_MAP = {
    1: "u's",
    2: "aqours",
    3: "nijigasaki",
    4: "liella",
    6: "hasunosora"
}

# Canonical Subunit IDs from artists-info.json
SUBUNIT_CONFIG = {
    "u's": {"Printemps": "2", "lily white": "3", "BiBi": "4"},
    "aqours": {"CYaRon！": "34", "AZALEA": "35", "Guilty Kiss": "36"},
    "nijigasaki": {"DiverDiva": "61", "A・ZU・NA": "62", "QU4RTZ": "63", "R3BIRTH": "99"},
    "liella": {"CatChu!": "160", "KALEIDOSCORE": "161", "5syncri5e!": "162"},
    "hasunosora": {
        "Cerise Bouquet": "134", 
        "DOLLCHESTRA": "135", 
        "Mira-Cra Park!": "136",
        "Edel Note": "201"
    }
}

def wrangle():
    print("🪄  Starting data wrangle with custom flag support...")
    
    # Load Source Files
    with open(DATA_DIR / "song-info.json", 'r', encoding='utf-8') as f:
        songs_raw = json.load(f)
    with open(DATA_DIR / "artists-info.json", 'r', encoding='utf-8') as f:
        artists_raw = json.load(f)

    artist_map = {str(a['id']): a for a in artists_raw}
    
    processed_songs = {name: [] for name in FRANCHISE_MAP.values()}
    subgroups = {name: {
        "all_songs": {"name": "All Songs", "is_custom": False, "is_subunit": False, "songs": []},
        "solos": {"name": "Solos", "is_custom": False, "is_subunit": False, "songs": []}
    } for name in FRANCHISE_MAP.values()}

    # Initialize Subunit containers
    for f_name, units in SUBUNIT_CONFIG.items():
        for unit_name in units.keys():
            # Standardizing keys for TOML
            key = unit_name.lower().replace(" ", "_").replace("！", "").replace("!", "").replace("・", "_")
            subgroups[f_name][key] = {
                "name": unit_name,
                "is_custom": False, # Canonical data is never custom
                "is_subunit": True,
                "songs": []
            }

    # Process every song
    for s in songs_raw:
        if not s.get('seriesIds'): continue
        series_id = s['seriesIds'][0]
        if series_id not in FRANCHISE_MAP: continue
        f_name = FRANCHISE_MAP[series_id]
        song_name = s['name']
        
        # 1. Main Song List
        yt_url = None
        if s.get('musicVideo') and s['musicVideo'].get('videoId'):
            yt_url = f"https://www.youtube.com/watch?v={s['musicVideo']['videoId']}"
            
        processed_songs[f_name].append({"name": song_name, "youtube_url": yt_url})
        
        # 2. All Songs
        subgroups[f_name]["all_songs"]["songs"].append(song_name)
        
        # Determine unique performers
        unique_char_ids = set()
        artist_refs = [str(a['id']) for a in s.get('artists', [])]
        for aid in artist_refs:
            if aid in artist_map:
                for cid in artist_map[aid].get('characters', []):
                    if cid: unique_char_ids.add(cid)
        
        # 3. Solos
        if len(unique_char_ids) == 1:
            subgroups[f_name]["solos"]["songs"].append(song_name)
            
        # 4. Subunits
        for unit_name, unit_id in SUBUNIT_CONFIG.get(f_name, {}).items():
            if unit_id in artist_refs:
                key = unit_name.lower().replace(" ", "_").replace("！", "").replace("!", "").replace("・", "_")
                subgroups[f_name][key]["songs"].append(song_name)

    # OUTPUT: Franchise song jsons
    for f_name, song_list in processed_songs.items():
        f_name_clean = f_name.replace("'", "")
        with open(OUTPUT_DIR / f"{f_name_clean}_songs.json", 'w', encoding='utf-8') as f:
            json.dump(song_list, f, ensure_ascii=False, indent=2)

    # OUTPUT: Consolidated subgroups.toml
    with open(OUTPUT_DIR / "subgroups.toml", 'w', encoding='utf-8') as f:
        for f_name, groups in subgroups.items():
            f.write(f"# --- {f_name} ---\n\n")
            for key, config in groups.items():
                if not config['songs']: continue 
                
                f.write(f"[{f_name}.{key}]\n")
                f.write(f"name = \"{config['name']}\"\n")
                f.write("is_custom = false\n") # ADDED: Explicitly false
                if config.get("is_subunit"):
                    f.write("is_subunit = true\n")
                f.write("songs = [\n")
                for s_name in config['songs']:
                    safe_song = s_name.replace('"', '\\"')
                    f.write(f"    \"{safe_song}\",\n")
                f.write("]\n\n")
    
    print("✨ Wrangle complete. is_custom=false flags added.")

if __name__ == "__main__":
    wrangle()