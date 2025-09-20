"""
Database models for compliance application using SQLAlchemy 2.0.
"""

from datetime import datetime
from typing import List, Optional
from uuid import uuid4
from sqlalchemy import String, DateTime, Text, Boolean, JSON, ForeignKey, Index, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.session import Base


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
    type_certificate: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # Transport, Normal, Utility, etc.
    max_seats: Mapped[Optional[int]] = mapped_column(nullable=True)
    max_weight_kg: Mapped[Optional[int]] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    regulations: Mapped[List["Regulation"]] = relationship(
        "Regulation", 
        secondary=regulation_models, 
        back_populates="aircraft_models"
    )
    compliance_checks: Mapped[List["ComplianceCheck"]] = relationship("ComplianceCheck", back_populates="aircraft_model")
    
    # Indexes
    __table_args__ = (
        Index('idx_aircraft_manufacturer_model', 'manufacturer', 'model'),
    )


class Regulation(Base):
    """Aviation regulation or requirement."""
    
    __tablename__ = "regulations"
    
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    authority_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey('authorities.id'), nullable=False)
    reference: Mapped[str] = mapped_column(String(100), nullable=False, index=True)  # e.g., "RBAC 121.445"
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    subcategory: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    effective_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    amendment_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")  # active, superseded, revoked
    content: Mapped[dict] = mapped_column(JSON, nullable=True)  # Full regulation content
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    authority: Mapped["Authority"] = relationship("Authority", back_populates="regulations")
    aircraft_models: Mapped[List["AircraftModel"]] = relationship(
        "AircraftModel", 
        secondary=regulation_models, 
        back_populates="regulations"
    )
    compliance_checks: Mapped[List["ComplianceCheck"]] = relationship("ComplianceCheck", back_populates="regulation")
    
    # Indexes
    __table_args__ = (
        Index('idx_regulation_authority_reference', 'authority_id', 'reference'),
        Index('idx_regulation_category', 'category'),
        Index('idx_regulation_status', 'status'),
    )


class ComplianceCheck(Base):
    """Individual compliance check result."""
    
    __tablename__ = "compliance_checks"
    
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    aircraft_model_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey('aircraft_models.id'), nullable=False)
    regulation_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey('regulations.id'), nullable=False)
    check_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    status: Mapped[str] = mapped_column(String(20), nullable=False)  # compliant, non_compliant, not_applicable, pending
    compliance_percentage: Mapped[Optional[float]] = mapped_column(nullable=True)
    details: Mapped[dict] = mapped_column(JSON, nullable=True)  # Detailed check results
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    checked_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    aircraft_model: Mapped["AircraftModel"] = relationship("AircraftModel", back_populates="compliance_checks")
    regulation: Mapped["Regulation"] = relationship("Regulation", back_populates="compliance_checks")
    compliance_reports: Mapped[List["ComplianceReport"]] = relationship(
        "ComplianceReport",
        secondary="report_checks",
        back_populates="compliance_checks"
    )
    
    # Indexes
    __table_args__ = (
        Index('idx_compliance_aircraft_regulation', 'aircraft_model_id', 'regulation_id'),
        Index('idx_compliance_check_date', 'check_date'),
        Index('idx_compliance_status', 'status'),
    )


# Association table for many-to-many relationship between reports and checks
report_checks = Table(
    'report_checks',
    Base.metadata,
    Column('report_id', PGUUID(as_uuid=True), ForeignKey('compliance_reports.id')),
    Column('check_id', PGUUID(as_uuid=True), ForeignKey('compliance_checks.id')),
    Index('idx_report_checks_report', 'report_id'),
    Index('idx_report_checks_check', 'check_id'),
)


class ComplianceReport(Base):
    """Comprehensive compliance report for an aircraft model."""
    
    __tablename__ = "compliance_reports"
    
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4)
    aircraft_model_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey('aircraft_models.id'), nullable=False)
    report_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    report_type: Mapped[str] = mapped_column(String(50), nullable=False)  # full, delta, targeted
    overall_compliance: Mapped[float] = mapped_column(nullable=False)  # Overall compliance percentage
    total_checks: Mapped[int] = mapped_column(nullable=False)
    compliant_checks: Mapped[int] = mapped_column(nullable=False)
    non_compliant_checks: Mapped[int] = mapped_column(nullable=False)
    not_applicable_checks: Mapped[int] = mapped_column(nullable=False)
    pending_checks: Mapped[int] = mapped_column(nullable=False)
    summary: Mapped[dict] = mapped_column(JSON, nullable=True)  # Report summary and insights
    generated_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    aircraft_model: Mapped["AircraftModel"] = relationship("AircraftModel")
    compliance_checks: Mapped[List["ComplianceCheck"]] = relationship(
        "ComplianceCheck",
        secondary=report_checks,
        back_populates="compliance_reports"
    )
    
    # Indexes
    __table_args__ = (
        Index('idx_report_aircraft_date', 'aircraft_model_id', 'report_date'),
        Index('idx_report_type', 'report_type'),
        Index('idx_report_compliance', 'overall_compliance'),
    )