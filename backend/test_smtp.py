"""
Prueba SMTP — lee las credenciales de tu .env
Pon este archivo dentro de la carpeta backend/ y corre:
    python test_smtp.py
"""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# ✅ (Gmail por default)
HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
PORT = int(os.getenv("SMTP_PORT", 587))
USER = os.getenv("SMTP_USER", "")
PASS = os.getenv("SMTP_PASSWORD", "")

print(f"Host  : {HOST}")
print(f"Puerto: {PORT}")
print(f"Usuario: {USER}")
print(f"Contraseña: {'*' * len(PASS)} ({len(PASS)} caracteres)")
print("")

if not USER or not PASS:
    print("❌ SMTP_USER o SMTP_PASSWORD están vacíos en tu .env")
    exit(1)

try:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "✅ Prueba SMTP — SMUCKY'S Backend"
    msg["From"]    = USER
    msg["To"]      = USER
    msg.attach(MIMEText("<h2>Si ves esto, el SMTP funciona ✅</h2>", "html", "utf-8"))

    print("🔌 Conectando...")
    with smtplib.SMTP(HOST, PORT, timeout=15) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        print("🔑 Haciendo login...")
        server.login(USER, PASS)
        print("📤 Enviando correo de prueba...")
        server.sendmail(USER, USER, msg.as_string())

    print("")
    print("✅ CORREO ENVIADO — revisa la bandeja de entrada de " + USER)

except smtplib.SMTPAuthenticationError as e:
    print(f"❌ ERROR DE AUTENTICACIÓN: {e}")
    print("→ Genera una nueva contraseña de app en account.microsoft.com")

except Exception as e:
    print(f"❌ ERROR: {type(e).__name__}: {e}")
