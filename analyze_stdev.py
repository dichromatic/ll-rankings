import sqlite3
import statistics
import json

# Connect to DB
conn = sqlite3.connect(r'c:\Users\trios\.gemini\antigravity\scratch\ll-rankings\api\rankings.db')
c = conn.cursor()

# Get parsed_rankings from submissions
c.execute("SELECT parsed_rankings FROM submissions")
rows = c.fetchall()

song_ranks = {}
for row in rows:
    # Each row[0] is a JSON string of {song_id: rank}
    try:
        rankings_map = json.loads(row[0])
        for song_id, rank in rankings_map.items():
            if song_id not in song_ranks:
                song_ranks[song_id] = []
            song_ranks[song_id].append(int(rank))
    except (json.JSONDecodeError, ValueError, TypeError):
        continue

# Calculate StDev for each song
stats = []
for sid, ranks in song_ranks.items():
    if len(ranks) > 1:
        stdev = statistics.stdev(ranks)
        stats.append(stdev)

# Analyze distribution
total = len(stats)
if total == 0:
    print("No ranking data found.")
    exit()

cyan = len([s for s in stats if s < 15])
purple = len([s for s in stats if 15 <= s < 22])
pink = len([s for s in stats if 22 <= s < 28])
red = len([s for s in stats if s >= 28])

print(f"Total Songs with >1 rank: {total}")
print(f"Cyan (<15): {cyan} ({cyan/total*100:.1f}%)")
print(f"Purple (15-22): {purple} ({purple/total*100:.1f}%)")
print(f"Pink (22-28): {pink} ({pink/total*100:.1f}%)")
print(f"Red (>=28): {red} ({red/total*100:.1f}%)")

print(f"\nMin StDev: {min(stats):.2f}")
print(f"Max StDev: {max(stats):.2f}")
print(f"Avg StDev: {statistics.mean(stats):.2f}")
