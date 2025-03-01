# routes/dashboard.py
from fastapi import APIRouter, Path
from models.response_models import DashboardData
from utils.data_generators import generate_dashboard_data

router = APIRouter()

@router.get("/{article_id}", response_model=DashboardData)
async def get_dashboard(
    article_id: str = Path(..., description="ID of the analyzed content")
):
    """Get existing analysis by article ID"""
    return generate_dashboard_data(article_id)