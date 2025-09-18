"""Main application file."""
from fastapi import FastAPI
from src.api import compliance

app = FastAPI()

app.include_router(compliance.router)
