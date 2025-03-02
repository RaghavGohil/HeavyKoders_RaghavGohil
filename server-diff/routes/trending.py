# routes/trending.py
from fastapi import APIRouter, Query
from typing import List

from models.response_models import TrendingTopic
from utils.data_generators import generate_trending_topics

router = APIRouter()

@router.get("", response_model=List[TrendingTopic])
async def get_trending_topics():
    """Get exactly 6 trending topics"""
    return generate_trending_topics()  # Remove parameter from this call