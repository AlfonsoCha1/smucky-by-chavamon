# ES: Comentarios base para mantenimiento.
# EN: Baseline comments for maintenance.
"""
backend/firebase_config.py
Inicializacion segura de Firebase Admin SDK para usar Firestore.

Como configurar el JSON de Service Account:
1) Coloca el archivo en backend/secrets/firebase-service-account.json
   (o en otra ruta fuera del repo).
2) Define FIREBASE_CREDENTIALS_PATH en .env con esa ruta.
3) Opcionalmente define FIREBASE_PROJECT_ID si deseas forzar el proyecto.

No incluyas credenciales directas en el codigo.
"""
from __future__ import annotations

import threading
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore

import config

_lock = threading.Lock()
_db: firestore.Client | None = None


def _resolve_credentials_path() -> Path | None:
    """Obtiene la ruta del JSON desde FIREBASE_CREDENTIALS_PATH."""
    if not config.FIREBASE_CREDENTIALS_PATH:
        return None
    return Path(config.FIREBASE_CREDENTIALS_PATH)


def get_firestore_client() -> firestore.Client:
    """Devuelve un cliente singleton de Firestore inicializando Firebase Admin una sola vez."""
    global _db
    if _db is not None:
        return _db

    with _lock:
        if _db is not None:
            return _db

        options: dict[str, str] = {}
        if config.FIREBASE_PROJECT_ID:
            options["projectId"] = config.FIREBASE_PROJECT_ID

        credentials_path = _resolve_credentials_path()
        if credentials_path is not None:
            if not credentials_path.exists():
                raise FileNotFoundError(
                    f"No se encontro FIREBASE_CREDENTIALS_PATH: {credentials_path}"
                )
            cred = credentials.Certificate(str(credentials_path))
            app = firebase_admin.initialize_app(cred, options or None)
        else:
            # Fallback para entornos con credenciales administradas (ADC).
            app = firebase_admin.initialize_app(options=options or None)

        _db = firestore.client(app=app)
        return _db

