from dotenv import load_dotenv
import os

# load environment variables from .env
load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:password@localhost:5432/mlforge"
    )

    ALGORITHM = os.getenv("ALGORITHM", "HS256")