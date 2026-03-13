from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from app.config import Config
from .models import  Dataset, DatasetVersion, Base

class Database:
    """
    Handles SQLAlchemy engine, session, and base model.
    Provides a dependency for FastAPI routes.
    """
    engine = create_engine(
        Config.DATABASE_URL
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)

    @staticmethod
    def get_db() -> Generator[Session, None, None]:
        """
        Dependency for FastAPI routes.
        Yields a database session and ensures it is closed after use.
        """
        print("database url:", Config.DATABASE_URL)
        db = Database.SessionLocal()
        try:
            yield db
        finally:
            db.close()