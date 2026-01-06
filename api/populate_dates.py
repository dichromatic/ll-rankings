
import json
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import init_engine, get_session
from app.models import Song

def populate_dates():
    print("Initializing DB...")
    init_engine()
    db = get_session()
    
    # Load song info
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level from 'api' if we are in api root, but data is in 'data' folder at root
    # Adjust path assuming this script is run from `api/` folder
    # scratch/ll-rankings/api -> scratch/ll-rankings/data
    data_path = os.path.join(base_dir, "..", "data", "song-info.json")
    
    print(f"Loading data from {data_path}...")
    with open(data_path, 'r', encoding='utf-8') as f:
        song_data = json.load(f)
        
    # Create map of name -> releasedOn
    date_map = {}
    for entry in song_data:
        if 'releasedOn' in entry and entry['releasedOn']:
            date_map[entry['name']] = entry['releasedOn']
            
    print(f"Found {len(date_map)} dates in JSON.")
    
    # Update DB
    songs = db.query(Song).all()
    updated = 0
    
    print(f"Checking {len(songs)} songs in DB...")
    
    for song in songs:
        if song.name in date_map:
            date_str = date_map[song.name]
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d").date()
                song.release_date = dt
                updated += 1
            except ValueError:
                print(f"Invalid date format for {song.name}: {date_str}")
                
    if updated > 0:
        db.commit()
        print(f"Successfully updated {updated} songs with release dates.")
    else:
        print("No updates needed or no matches found.")
        
    db.close()

if __name__ == "__main__":
    populate_dates()
