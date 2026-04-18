# ES: Comentarios base para mantenimiento.
# EN: Baseline comments for maintenance.
"""
backend/config.py
Lee variables de entorno desde .env y las expone como constantes tipadas.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


SMTP_HOST: str = os.environ["SMTP_HOST"]
SMTP_PORT: int = int(os.environ["SMTP_PORT"])
SMTP_USER: str = os.environ["SMTP_USER"]
SMTP_PASSWORD: str = os.environ["SMTP_PASSWORD"]

FIREBASE_PROJECT_ID: str | None = os.getenv("FIREBASE_PROJECT_ID")
FIREBASE_CREDENTIALS_PATH: str | None = os.getenv("FIREBASE_CREDENTIALS_PATH")
if FIREBASE_CREDENTIALS_PATH and not os.path.isabs(FIREBASE_CREDENTIALS_PATH):
	_backend_dir = Path(__file__).resolve().parent
	_repo_dir = _backend_dir.parent
	_path_from_backend = (_backend_dir / FIREBASE_CREDENTIALS_PATH).resolve()
	_path_from_repo = (_repo_dir / FIREBASE_CREDENTIALS_PATH).resolve()
	if _path_from_backend.exists():
		FIREBASE_CREDENTIALS_PATH = str(_path_from_backend)
	else:
		FIREBASE_CREDENTIALS_PATH = str(_path_from_repo)

# Lista de orÃ­genes CORS permitidos
_default_origins = (
	"http://127.0.0.1:5500,"
	"http://localhost:5500,"
	"http://localhost:3000,"
	"https://smucky-by-chavamon.vercel.app"
)
_raw_origins = os.getenv("ALLOWED_ORIGINS", _default_origins)
ALLOWED_ORIGINS: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# Tiempo de expiraciÃ³n de los cÃ³digos (segundos)
CODE_TTL_SECONDS: int = 600  # 10 minutos

