from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Optional
import random

from models.request_models import AnalysisRequest
from models.response_models import DashboardData
from utils.data_generators import generate_dashboard_data

router = APIRouter()

@router.get("/", response_model=Dict[str, str])
async def landing_page():
    return {
        "status": "ok",
        "message": "Welcome to the Misinformation Analysis Dashboard API",
        "version": "1.0.0"
    }

@router.post("/analyze", response_model=DashboardData)
async def analyze_content(request: AnalysisRequest):
    if not (request.url or request.keyword or request.hashtag):
        raise HTTPException(
            status_code=400,
            detail="At least one of url, keyword, or hashtag must be provided"
        )
    
    # Generate random content ID for POST endpoint
    content_id = str(random.randint(1000, 9999))
    return generate_dashboard_data(content_id)