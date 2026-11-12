from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.pacer.api import router as pacer_router

app = FastAPI(
    title="RoutePulse API",
    description="Group-aware route planning and safety monitoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pacer_router)


@app.get("/")
def home():
    return {
        "project": "RoutePulse",
        "message": "Backend is running!",
    }
