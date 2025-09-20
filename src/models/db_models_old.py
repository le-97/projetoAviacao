"""
SQLAlchemy ORM models for compliance database.
"""

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, Text, JSON, Index, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
from typing import List, Optional, Dict, Any
import uuid

from src.db.session import Base


# Association table for many-to-many relationship between regulations and aircraft models
regulation_models = Table(
    'regulation_models',
    Base.metadata,
    mapped_column('regulation_id', UUID(as_uuid=True), ForeignKey('regulations.id')),
    mapped_column('aircraft_model_id', UUID(as_uuid=True), ForeignKey('aircraft_models.id')),
    Index('idx_regulation_models_regulation', 'regulation_id'),
    Index('idx_regulation_models_model', 'aircraft_model_id'),
)


class Authority(Base):
    """Aviation regulatory authority (ANAC, FAA, EASA, etc.)."""
    
    __tablename__ = "authorities"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[Optional[str]] = mapped_column(String(3), nullable=True)  # ISO 3166-1 alpha-3
    website: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    regulations: Mapped[List["Regulation"]] = relationship("Regulation", back_populates="authority")
    
    def __repr__(self) -> str:
        return f"<Authority(code='{self.code}', name='{self.name}')>"


class AircraftModel(Base):
    """Aircraft model information."""
    
    __tablename__ = "aircraft_models"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    model_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    manufacturer: Mapped[str] = mapped_column(String(100), nullable=False)
    model_name: Mapped[str] = mapped_column(String(255), nullable=False)
    series: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # commercial, cargo, regional, etc.
    max_passengers: Mapped[Optional[int]] = mapped_column(nullable=True)
    mtow_kg: Mapped[Optional[int]] = mapped_column(nullable=True)  # Maximum Take-Off Weight
    metadata_json: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    regulations: Mapped[List["Regulation"]] = relationship("Regulation", secondary=regulation_models, back_populates="aircraft_models")
    compliance_checks: Mapped[List["ComplianceCheck"]] = relationship("ComplianceCheck", back_populates="aircraft_model")
    
    def __repr__(self) -> str:
        return f"<AircraftModel(model_code='{self.model_code}', manufacturer='{self.manufacturer}')>"


class Regulation(Base):
    """Regulatory compliance requirement."""
    
    __tablename__ = "regulations"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    authority_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("authorities.id"), nullable=False)
    regulation_code: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Text] = mapped_column(Text, nullable=False)
    regulation_type: Mapped[str] = mapped_column(String(50), nullable=False)  # RBAC, TCDS, AD, STC, etc.
    effective_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    expiry_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    compliance_status: Mapped[str] = mapped_column(String(20), default="applicable", nullable=False)  # applicable, superseded, withdrawn
    details_json: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    authority: Mapped["Authority"] = relationship("Authority", back_populates="regulations")
    aircraft_models: Mapped[List["AircraftModel"]] = relationship("AircraftModel", secondary=regulation_models, back_populates="regulations")
    compliance_checks: Mapped[List["ComplianceCheck"]] = relationship("ComplianceCheck", back_populates="regulation")
    
    # Indexes
    __table_args__ = (
        Index('idx_regulation_authority', 'authority_id'),
        Index('idx_regulation_code', 'regulation_code'),
        Index('idx_regulation_type', 'regulation_type'),
        Index('idx_regulation_active', 'is_active'),
        Index('idx_regulation_status', 'compliance_status'),
    )
    
    def __repr__(self) -> str:
        return f"<Regulation(regulation_code='{self.regulation_code}', authority='{self.authority.code if self.authority else None}')>"


class ComplianceCheck(Base):
    """Record of compliance check performed."""
    
    __tablename__ = "compliance_checks"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aircraft_model_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("aircraft_models.id"), nullable=False)
    regulation_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("regulations.id"), nullable=False)
    country_code: Mapped[str] = mapped_column(String(3), nullable=False, index=True)  # ISO 3166-1 alpha-3
    check_result: Mapped[str] = mapped_column(String(20), nullable=False)  # compliant, non_compliant, pending, not_applicable
    risk_level: Mapped[str] = mapped_column(String(10), nullable=False)  # low, medium, high, critical
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    checked_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    check_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    aircraft_model: Mapped["AircraftModel"] = relationship("AircraftModel", back_populates="compliance_checks")
    regulation: Mapped["Regulation"] = relationship("Regulation", back_populates="compliance_checks")
    
    # Indexes
    __table_args__ = (
        Index('idx_compliance_aircraft_model', 'aircraft_model_id'),
        Index('idx_compliance_regulation', 'regulation_id'),
        Index('idx_compliance_country', 'country_code'),
        Index('idx_compliance_result', 'check_result'),
        Index('idx_compliance_risk', 'risk_level'),
        Index('idx_compliance_created', 'created_at'),
        # Composite indexes for common queries
        Index('idx_compliance_model_country', 'aircraft_model_id', 'country_code'),
        Index('idx_compliance_model_result', 'aircraft_model_id', 'check_result'),
    )
    
    def __repr__(self) -> str:
        return f"<ComplianceCheck(aircraft_model='{self.aircraft_model.model_code if self.aircraft_model else None}', result='{self.check_result}')>"


class ComplianceReport(Base):
    """Generated compliance report."""
    
    __tablename__ = "compliance_reports"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    aircraft_model_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("aircraft_models.id"), nullable=False)
    country_code: Mapped[str] = mapped_column(String(3), nullable=False, index=True)
    report_type: Mapped[str] = mapped_column(String(50), nullable=False)  # summary, detailed, audit
    overall_status: Mapped[str] = mapped_column(String(20), nullable=False)  # compliant, non_compliant, partial
    total_checks: Mapped[int] = mapped_column(nullable=False)
    compliant_checks: Mapped[int] = mapped_column(nullable=False)
    non_compliant_checks: Mapped[int] = mapped_column(nullable=False)
    pending_checks: Mapped[int] = mapped_column(nullable=False)
    report_data: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    generated_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    aircraft_model: Mapped["AircraftModel"] = relationship("AircraftModel")
    
    # Indexes
    __table_args__ = (
        Index('idx_report_aircraft_model', 'aircraft_model_id'),
        Index('idx_report_country', 'country_code'),
        Index('idx_report_status', 'overall_status'),
        Index('idx_report_created', 'created_at'),
        Index('idx_report_expires', 'expires_at'),
        # Composite indexes
        Index('idx_report_model_country', 'aircraft_model_id', 'country_code'),
    )
    
    def __repr__(self) -> str:
        return f"<ComplianceReport(aircraft_model='{self.aircraft_model.model_code if self.aircraft_model else None}', status='{self.overall_status}')>"