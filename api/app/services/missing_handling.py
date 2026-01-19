# app/services/missing_handling.py

from typing import Dict, Set

class MissingSongHandler:

    @staticmethod
    def append_to_end(ranked: Dict[str, float], missing: Set[str]) -> Dict[str, float]:
        if not ranked:
            # If no songs were ranked, put missing songs at rank 1
            return {song_id: 1.0 for song_id in missing}
    
        sorted_ranks = sorted(ranked.values())
        
        # Frequency map of how many songs occupy each rank
        ties = {}
        for r in sorted_ranks:
            ties[r] = ties.get(r, 0) + 1
    
        has_single_gap = False
        gap_start = 0
        gap_end = 0 
        prev_rank = 0
        prev_count = 1 # Initial offset for rank 0
    
        unique_ranks = sorted(ties.keys())
        
        # Check for gaps between ranks
        current_pos = 1
        for rank in unique_ranks:
            if rank > current_pos:
                # We found a gap
                if has_single_gap: 
                    has_single_gap = False # Multiple gaps found
                    break
                has_single_gap = True
                gap_start = current_pos
                gap_end = rank
            
            current_pos = rank + ties[rank]
    
        new_rank = max(sorted_ranks) + 1
    
        # Autofill into gap if the missing count fits perfectly
        if has_single_gap and len(missing) == int(gap_end - gap_start):
            new_rank = gap_start
    
        for song in missing:
            ranked[song] = float(new_rank)
    
        return ranked
        
    @staticmethod
    def rerank(ranked: Dict[str, float], missing: Dict[str, float]) -> Dict[str, float]:
        displacing = {}
        new_ranked = ranked.copy()
        initial_inserts = {}

        # Insert songs which won't displace existing songs in rank
        for song, rank in missing.items():
            if rank in ranked.values():
                displacing[song] = rank
            else:
                new_ranked[song] = rank
                if rank in initial_inserts:
                    initial_inserts[rank] += 1
                else:
                    initial_inserts[rank] = 1

        ranked = {song: new_ranked[song] for song in sorted(new_ranked, key=new_ranked.get)}

        # Insert songs which will displace existing songs
        offset = 0
        new_ranked = {}
        for song, rank in ranked.items():
            displace_by = list(displacing.values()).count(rank)
            if displace_by > 0:
                offset += displace_by
                is_same_rank = lambda k : displacing[k] == rank
                for new_song in filter(is_same_rank,displacing.keys()):
                    new_ranked[new_song] = rank

            # We don't want pre-inserted songs to be displaced by an earlier displacement in this loop
            if rank in initial_inserts:
                new_ranked[song] = rank
                continue
            # Instead the existing songs get moved past the pre-inserted songs
            else:
                while rank + offset in initial_inserts:
                    offset += initial_inserts[rank + offset]

            new_ranked[song] = rank + offset

        return new_ranked
