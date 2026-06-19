from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    func,
    Boolean,
    JSON,
    UniqueConstraint,
    ForeignKey,
)

from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    # NextAuth user id (UUID / CUID string)
    user_id = Column(String, nullable=False, index=True)

    is_public = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    versions = relationship(
        "DatasetVersion",
        back_populates="dataset",
        cascade="all, delete-orphan"
    )


class DatasetVersion(Base):
    __tablename__ = "dataset_versions"

    id = Column(Integer, primary_key=True, index=True)

    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)

    version_number = Column(Integer, nullable=False)

    file_path = Column(String, nullable=False)

    rows = Column(Integer, nullable=True)
    columns = Column(Integer, nullable=True)

    dtypes = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    dataset = relationship("Dataset", back_populates="versions")

    __table_args__ = (
        UniqueConstraint("dataset_id", "version_number", name="unique_dataset_version"),
    )