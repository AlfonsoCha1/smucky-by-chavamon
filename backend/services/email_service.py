# ES: Comentarios base para mantenimiento.
# EN: Baseline comments for maintenance.
"""
backend/services/email_service.py
Envía correos HTML vía SMTP usando plantillas Jinja2.
"""
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

import config
from services.code_service import generate_code

# Directorio de plantillas relativo a este archivo
_TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

_jinja_env = Environment(
    loader=FileSystemLoader(str(_TEMPLATES_DIR)),
    autoescape=select_autoescape(["html"]),
)


SENDER_EMAIL = "SMUCKY'S BY CHAVAMON <smuckys.chavamon@gmail.com>"
logger = logging.getLogger(__name__)


def _render(template_name: str, context: dict) -> str:
    """Renderiza una plantilla Jinja2 y devuelve el HTML como cadena."""
    template = _jinja_env.get_template(template_name)
    return template.render(**context)


def send_verification_email(email: str, nombre: str, tipo: str) -> None:
    """
    Construye el mensaje HTML y lo envía al destinatario via SMTP.

    Parámetros
    ----------
    email   : dirección del usuario (cualquier proveedor)
    nombre  : nombre del usuario para personalizar el saludo
    tipo    : selecciona la plantilla a usar
    """
    template_map = {
        "registro": "registro.html",
        "recuperacion": "recuperacion.html",
    }
    if tipo not in template_map:
        raise ValueError(f"Tipo de correo desconocido: {tipo!r}")

    recipient = (email or "").strip().lower()
    if not recipient:
        raise ValueError("El destinatario del correo está vacío.")

    logger.warning(
        "[email-service] tipo=%s email_recibido=%s destinatario_final=%s",
        tipo,
        email,
        recipient,
    )

    codigo = generate_code(recipient, nombre, tipo)

    html_body = _render(
        template_map[tipo],
        {
            "nombre_usuario": nombre,
            "codigo_verificacion": codigo,
        },
    )

    subject_map = {
        "registro": "✅ Tu código de registro — SMUCKY'S BY CHAVARIN",
        "recuperacion": "🔑 Recuperación de contraseña — SMUCKY'S BY CHAVARIN",
    }

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject_map[tipo]
    msg["From"] = SENDER_EMAIL
    msg["To"] = recipient

    msg.attach(MIMEText(html_body, "html", "utf-8"))

    if config.SMTP_PORT == 465:
        with smtplib.SMTP_SSL(config.SMTP_HOST, config.SMTP_PORT, timeout=15) as server:
            server.login(config.SMTP_USER, config.SMTP_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient, msg.as_string())
    else:
        with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(config.SMTP_USER, config.SMTP_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient, msg.as_string())


