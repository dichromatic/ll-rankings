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
                ties[rank] = ties[rank] + 1
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

        return ranked;