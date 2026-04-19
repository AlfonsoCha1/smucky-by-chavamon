# ES: Comentarios base para mantenimiento.
# EN: Baseline comments for maintenance.
"""
backend/main.py
Punto de entrada de la aplicaciÃ³n FastAPI.
Ejecutar con:  uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ALLOWED_ORIGINS
from routes.auth import router as auth_router

app = FastAPI(
    title="SMUCKY´s By CHAVAMON â€” Auth API",
    description="Backend independiente para registro y recuperaciÃ³n de contraseÃ±a.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

app.include_router(auth_router)


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "smuckys-auth-api"}

