from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import routes
from routes.landing import router as landing_router
from routes.trending import router as trending_router
from routes.dashboard import router as dashboard_router

app = FastAPI(
    title="Misinformation Analysis Dashboard",
    description="API for analyzing misinformation in online content",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(landing_router)
app.include_router(trending_router, prefix="/trending")
app.include_router(dashboard_router, prefix="/dashboard")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)