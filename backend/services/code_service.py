# ES: Comentarios base para mantenimiento.
# EN: Baseline comments for maintenance.
"""
backend/services/code_service.py
Genera, almacena y valida códigos de 6 dígitos en Firestore con TTL de 10 minutos.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
import random

from config import CODE_TTL_SECONDS
from firebase_config import get_firestore_client

_COLLECTION = "codigos"


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def generate_code(email: str, nombre: str, tipo: str) -> str:
    """
    Genera un código aleatorio de 6 dígitos para email+tipo y lo guarda en Firestore.
    Sobrescribe cualquier código previo pendiente del mismo email+tipo.
    """
    if tipo not in {"registro", "recuperacion"}:
        raise ValueError(f"Tipo de código desconocido: {tipo!r}")

    code = f"{random.randint(0, 999999):06d}"
    now = _now_utc()
    expires_at = now + timedelta(seconds=CODE_TTL_SECONDS)
    normalized_email = email.strip().lower()

    db = get_firestore_client()
    db.collection(_COLLECTION).add(
        {
            "email": normalized_email,
            "nombre": nombre.strip(),
            "codigo": code,
            "tipo": tipo,
            "created_at": now,
            "expires_at": expires_at,
            "used": False,
        }
    )
    return code


def verify_code(email: str, code: str, tipo: str) -> bool:
    """
    Devuelve True si el código coincide, no expiró y no fue usado.
    Marca el código como usado tras una verificación exitosa (uso único).
    """
    if tipo not in {"registro", "recuperacion"}:
        return False

    db = get_firestore_client()
    normalized_email = email.strip().lower()
    query = (
        db.collection(_COLLECTION)
        .where("email", "==", normalized_email)
        .where("tipo", "==", tipo)
        .order_by("created_at", direction="DESCENDING")
        .limit(1)
    )
    docs = list(query.stream())
    if not docs:
        return False
    snapshot = docs[0]
    doc_ref = snapshot.reference

    data = snapshot.to_dict() or {}
    expires_at = data.get("expires_at")
    if data.get("used") is True:
        return False
    if data.get("codigo") != code.strip():
        return False
    if not isinstance(expires_at, datetime):
        return False
    if expires_at <= _now_utc():
        return False

    doc_ref.update({"used": True})
    return True
