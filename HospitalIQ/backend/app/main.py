"""
HospIntel - Healthcare Intelligence, Performance & ROI Platform
FastAPI application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import *  # noqa: F401 - Import all models so Base knows about them


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Seed data if configured
    if settings.SEED_ON_STARTUP:
        from app.seed.seed_data import seed_database
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()

    yield  # Application runs here


app = FastAPI(
    title=settings.APP_NAME,
    description="Healthcare Intelligence, Performance & ROI Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
from app.routers import (
    auth, dashboard, financial, operations,
    clinical, departments, investments, roi,
    alerts, predictions, insights
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(financial.router)
app.include_router(operations.router)
app.include_router(clinical.router)
app.include_router(departments.router)
app.include_router(investments.router)
app.include_router(roi.router)
app.include_router(alerts.router)
app.include_router(predictions.router)
app.include_router(insights.router)


@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "description": "Healthcare Intelligence, Performance & ROI Platform",
        "docs": "/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}
