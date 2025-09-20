"""
Database models for compliance application using SQLAlchemy 2.0 - SQLite compatible.
"""

from datetime import datetime
from typing import List, Optional
from uuid import uuid4
from sqlalchemy import String, DateTime, Text, Boolean, JSON, ForeignKey, Index, Table, Column, Integer, Float, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum as PyEnum

from src.database import Base


class PriorityEnum(PyEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Aircraft(Base):
    """Aircraft instances - individual aircraft in the fleet."""
    
    __tablename__ = "aircraft"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    aircraft_type: Mapped[str] = mapped_column(String(100), nullable=False)
    registration: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    current_hours: Mapped[float] = mapped_column(Float, default=0.0)
    last_inspection: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ComplianceRequirement(Base):
    """Compliance requirements that aircraft must meet."""
    
    __tablename__ = "compliance_requirements"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    authority: Mapped[str] = mapped_column(String(100), nullable=False)
    frequency_hours: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    aircraft_types: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string
    priority: Mapped[str] = mapped_column(String(20), default="MEDIUM")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Association table for many-to-many relationship between regulations and aircraft models
regulation_models = Table(
    'regulation_models',
    Base.metadata,
    Column('regulation_id', String(36), ForeignKey('regulations.id')),
    Column('aircraft_model_id', String(36), ForeignKey('aircraft_models.id')),
    Index('idx_regulation_models_regulation', 'regulation_id'),
    Index('idx_regulation_models_model', 'aircraft_model_id'),
)


class Authority(Base):
    """Aviation regulatory authority (ANAC, FAA, EASA, etc.)."""
    
    __tablename__ = "authorities"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[Optional[str]] = mapped_column(String(3), nullable=True)  # ISO 3166-1 alpha-3
    website: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    regulations: Mapped[List["Regulation"]] = relationship("Regulation", back_populates="authority")


class AircraftModel(Base):
    """Aircraft model information."""
    
    __tablename__ = "aircraft_models"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    manufacturer: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    model: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    variant: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    type_certificate: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    max_seats: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_weight_kg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    compliance_checks: Mapped[List["ComplianceCheck"]] = relationship("ComplianceCheck", back_populates="aircraft_model")
    regulations: Mapped[List["Regulation"]] = relationship(
        "Regulation", 
        secondary=regulation_models, 
        back_populates="aircraft_models"
    )


class Regulation(Base):
    """Aviation regulation information."""
    
    __tablename__ = "regulations"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    authority_id: Mapped[str] = mapped_column(String(36), ForeignKey('authorities.id'), nullable=False)
    reference: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    subcategory: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)  # active, superseded, withdrawn
    effective_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    content: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    authority: Mapped["Authority"] = relationship("Authority", back_populates="regulations")
    compliance_checks: Mapped[List["ComplianceCheck"]] = relationship("ComplianceCheck", back_populates="regulation")
    aircraft_models: Mapped[List["AircraftModel"]] = relationship(
        "AircraftModel", 
        secondary=regulation_models, 
        back_populates="regulations"
    )


class ComplianceCheck(Base):
    """Individual compliance check for an aircraft model against a regulation."""
    
    __tablename__ = "compliance_checks"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    aircraft_model_id: Mapped[str] = mapped_column(String(36), ForeignKey('aircraft_models.id'), nullable=False)
    regulation_id: Mapped[str] = mapped_column(String(36), ForeignKey('regulations.id'), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, index=True)  # compliant, non_compliant, pending, not_applicable
    severity: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # critical, major, minor, info
    findings: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recommendations: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    checked_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    checked_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    evidence_documents: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    extra_metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    aircraft_model: Mapped["AircraftModel"] = relationship("AircraftModel", back_populates="compliance_checks")
    regulation: Mapped["Regulation"] = relationship("Regulation", back_populates="compliance_checks")
    reports: Mapped[List["ComplianceReport"]] = relationship(
        "ComplianceReport", 
        secondary="report_checks", 
        back_populates="checks"
    )

    # Add indexes for better query performance
    __table_args__ = (
        Index('idx_compliance_checks_aircraft_regulation', 'aircraft_model_id', 'regulation_id'),
        Index('idx_compliance_checks_status', 'status'),
        Index('idx_compliance_checks_severity', 'severity'),
    )


# Association table for many-to-many relationship between reports and checks
report_checks = Table(
    'report_checks',
    Base.metadata,
    Column('report_id', String(36), ForeignKey('compliance_reports.id')),
    Column('check_id', String(36), ForeignKey('compliance_checks.id')),
    Index('idx_report_checks_report', 'report_id'),
    Index('idx_report_checks_check', 'check_id'),
)


class ComplianceReport(Base):
    """Compliance report aggregating multiple checks."""
    
    __tablename__ = "compliance_reports"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    aircraft_model_id: Mapped[str] = mapped_column(String(36), ForeignKey('aircraft_models.id'), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    overall_status: Mapped[str] = mapped_column(String(20), nullable=False, index=True)  # compliant, non_compliant, partial
    report_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # certification, audit, inspection
    generated_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    extra_metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    aircraft_model: Mapped["AircraftModel"] = relationship("AircraftModel")
    checks: Mapped[List["ComplianceCheck"]] = relationship(
        "ComplianceCheck", 
        secondary=report_checks, 
        back_populates="reports"
    )
    
    # Add indexes for better query performance
    __table_args__ = (
        Index('idx_compliance_reports_aircraft_status', 'aircraft_model_id', 'overall_status'),
        Index('idx_compliance_reports_type', 'report_type'),
        Index('idx_compliance_reports_generated', 'generated_at'),
    )