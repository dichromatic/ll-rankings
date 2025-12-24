# app/services/missing_handling.py

from typing import Dict, Set

class MissingSongHandler:

    @staticmethod
    def append_to_end(ranked: Dict[str, float], missing: Set[str]) -> Dict[str, float]:
        has_single_gap = False
        gap_start = 0
        gap_end = 0 # Exclusive
        prev = 0
        ties = {rank: 1 for rank in ranked.values()}
        ties[0] = 1

        for rank in ranked.values():
            # Need to consider gaps produced by ties
            if rank == prev:
                ties[rank] += 1
                continue

            # Gap detected and it's not due to a tie
            if rank - prev > ties[prev]:
                # Multiple missing blocks, impossible to infer rank
                if has_single_gap:
                    has_single_gap = False
                    break
                has_single_gap = True
                gap_start = prev + ties[prev]
                gap_end = rank

            prev = rank

        new_rank = max(ranked.values()) + 1

        # Autofill rank into gap when it's clear that's where missing songs go
        if has_single_gap and len(missing) == gap_end - gap_start:
            new_rank = gap_start # Same as a tie, tie_handling takes care of this

        for song in missing:
            ranked[song] = new_rank

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