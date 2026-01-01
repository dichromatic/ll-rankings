# app/api/v1/users.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Franchise, Submission, Song, Subgroup, SubmissionStatus
from app.services.ranking_utils import RelativeRankingService
from typing import List, Dict
from uuid import UUID

router = APIRouter(prefix="/api/v1", tags=["users"])


@router.get("/users/rankings")
async def get_user_rankings(franchise: str, subgroup: str, db: Session = Depends(get_db)):
    """Get all individual user rankings for a franchise/subgroup"""
    
    # Look up franchise
    franchise_obj = db.query(Franchise).filter_by(name=franchise).first()
    if not franchise_obj:
        raise HTTPException(status_code=404, detail="Franchise not found")
    
    # Look up subgroup to get the list of song IDs to filter by
    subgroup_obj = db.query(Subgroup).filter(
        Subgroup.name == subgroup,
        Subgroup.franchise_id == franchise_obj.id
    ).first()
    
    if not subgroup_obj or not subgroup_obj.song_ids:
        return {
            "franchise": franchise,
            "subgroup": subgroup,
            "total_users": 0,
            "users": []
        }
    
    subgroup_song_ids = subgroup_obj.song_ids
    
    # Get all valid submissions for this franchise
    submissions = (
        db.query(Submission)
        .filter(
            Submission.franchise_id == franchise_obj.id,
            Submission.submission_status == SubmissionStatus.VALID,
        )
        .all()
    )
    
    # Get song ID to name mapping for subgroup songs only
    songs = db.query(Song).filter(Song.id.in_([UUID(sid) for sid in subgroup_song_ids])).all()
    song_name_map = {str(s.id): s.name for s in songs}
    
    # Build response
    result = []
    for sub in submissions:
        if not sub.parsed_rankings:
            continue
        
        # Use RelativeRankingService to get rankings relative to this subgroup
        rel_map = RelativeRankingService.relativize(
            sub.parsed_rankings, 
            subgroup_song_ids
        )
        
        if not rel_map:
            continue
            
        # Convert to song names and rankings, sorted by relative rank
        rankings = []
        for song_id, rank in sorted(rel_map.items(), key=lambda x: x[1]):
            song_name = song_name_map.get(song_id, "Unknown")
            rankings.append({
                "song_name": song_name,
                "rank": round(rank)
            })
        
        result.append({
            "username": sub.username,
            "submission_date": sub.created_at,
            "total_songs": len(rankings),
            "rankings": rankings
        })
    
    # Sort by username
    result.sort(key=lambda x: x["username"].lower())
    
    return {
        "franchise": franchise,
        "subgroup": subgroup,
        "total_users": len(result),
        "users": result
    }
