# ES: Comentarios base para mantenimiento.
# EN: Baseline comments for maintenance.
"""
backend/routes/auth.py
Endpoints para envÃ­o y verificaciÃ³n de cÃ³digos:
  POST /auth/registro/enviar-codigo
  POST /auth/registro/verificar-codigo
  POST /auth/recuperacion/enviar-codigo
  POST /auth/recuperacion/verificar-codigo
"""
import logging

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, field_validator

from services.code_service import verify_code
from services.email_service import send_verification_email

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)


# â”€â”€ Modelos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


class EnviarCodigoRequest(BaseModel):
    email: EmailStr
    nombre: str

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("El nombre no puede estar vacÃ­o.")
        return v


class VerificarCodigoRequest(BaseModel):
    email: EmailStr
    codigo: str

    @field_validator("codigo")
    @classmethod
    def codigo_valido(cls, v: str) -> str:
        v = v.strip()
        if not v.isdigit() or len(v) != 6:
            raise ValueError("El cÃ³digo debe ser exactamente 6 dÃ­gitos numÃ©ricos.")
        return v


# â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


def _enviar(tipo: str, payload: EnviarCodigoRequest) -> dict:
    logger.warning(
        "[auth][enviar-codigo] tipo=%s email=%s nombre=%s",
        tipo,
        payload.email,
        payload.nombre,
    )
    try:
        send_verification_email(payload.email, payload.nombre, tipo)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"No se pudo enviar el correo: {exc}",
        ) from exc
    return {"ok": True, "message": "CÃ³digo enviado. Revisa tu correo."}


def _verificar(email: str, codigo: str, tipo: str) -> dict:
    logger.warning(
        "[auth][verificar-codigo] tipo=%s email=%s codigo_len=%s",
        tipo,
        email,
        len(codigo.strip()),
    )
    if not verify_code(email, codigo, tipo):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CÃ³digo incorrecto o expirado.",
        )
    return {"ok": True, "message": "CÃ³digo verificado correctamente."}


# â”€â”€ Rutas de Registro â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


@router.post("/registro/enviar-codigo", status_code=status.HTTP_200_OK)
async def registro_enviar(payload: EnviarCodigoRequest):
    """Genera y envÃ­a un cÃ³digo de verificaciÃ³n para el registro."""
    return _enviar("registro", payload)


@router.post("/registro/verificar-codigo", status_code=status.HTTP_200_OK)
async def registro_verificar(payload: VerificarCodigoRequest):
    """Verifica el cÃ³digo ingresado por el usuario (registro)."""
    return _verificar(payload.email, payload.codigo, "registro")


# â”€â”€ Rutas de RecuperaciÃ³n de ContraseÃ±a â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€


@router.post("/recuperacion/enviar-codigo", status_code=status.HTTP_200_OK)
async def recuperacion_enviar(payload: EnviarCodigoRequest):
    """Genera y envÃ­a un cÃ³digo para recuperaciÃ³n de contraseÃ±a."""
    return _enviar("recuperacion", payload)


@router.post("/recuperacion/verificar-codigo", status_code=status.HTTP_200_OK)
async def recuperacion_verificar(payload: VerificarCodigoRequest):
    """Verifica el cÃ³digo ingresado por el usuario (recuperaciÃ³n)."""
    return _verificar(payload.email, payload.codigo, "recuperacion")

