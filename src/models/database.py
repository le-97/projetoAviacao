"""
Database models for Aviation Compliance System
Modelos de dados para o sistema de compliance de aviação da Embraer
"""

from sqlalchemy import Column, Integer, String, Boolean, Float, JSON, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import List, Optional

Base = declarative_base()

class AircraftModel(Base):
    """Modelo de aeronave da família E-Jets"""
    __tablename__ = "aircraft_models"
    
    id = Column(Integer, primary_key=True, index=True)
    model = Column(String(50), unique=True, index=True, nullable=False)  # E.g., "E190-E2"
    series = Column(String(10), nullable=False)  # "E1" or "E2"
    manufacturer = Column(String(50), default="Embraer", nullable=False)
    
    # Specifications
    seats = Column(Integer, nullable=False)
    mtow_lbs = Column(Integer, nullable=False)  # Maximum Takeoff Weight
    range_nm = Column(Integer, nullable=False)  # Range in nautical miles
    fuel_capacity_kg = Column(Integer, nullable=False)
    
    # Engine information
    engine_type = Column(String(100), nullable=False)
    engine_count = Column(Integer, default=2)
    
    # Avionics
    avionics = Column(String(100), nullable=False)
    
    # Compliance levels
    noise_compliance = Column(String(50), nullable=False)  # E.g., "ICAO Chapter 14"
    emissions_compliance = Column(String(50), nullable=False)  # E.g., "Stage 5"
    
    # Safety and scoring
    safety_rating = Column(String(10), nullable=False)  # E.g., "A+"
    base_score = Column(Float, nullable=False)
    
    # Certification
    certifications = Column(JSON)  # List of certifications
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    compliance_records = relationship("ComplianceRecord", back_populates="aircraft")

class RegulatoryAuthority(Base):
    """Autoridades regulatórias (FAA, EASA, ANAC, ICAO)"""
    __tablename__ = "regulatory_authorities"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True, nullable=False)  # E.g., "FAA"
    name = Column(String(100), nullable=False)  # E.g., "Federal Aviation Administration"
    region = Column(String(50), nullable=False)  # E.g., "USA"
    description = Column(Text)
    website = Column(String(200))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    compliance_records = relationship("ComplianceRecord", back_populates="authority")

class ComplianceRecord(Base):
    """Registros de compliance entre aeronaves e autoridades"""
    __tablename__ = "compliance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign keys
    aircraft_id = Column(Integer, ForeignKey("aircraft_models.id"), nullable=False)
    authority_id = Column(Integer, ForeignKey("regulatory_authorities.id"), nullable=False)
    
    # Compliance data
    compliance_status = Column(String(20), nullable=False)  # "COMPLIANT", "NON_COMPLIANT", "PENDING"
    score = Column(Float, nullable=False)
    check_type = Column(String(50), default="full")  # "full", "noise", "emissions", "safety"
    
    # Details (JSON structure for flexibility)
    details = Column(JSON)
    
    # Verification
    verified_by = Column(String(100))
    verification_date = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    aircraft = relationship("AircraftModel", back_populates="compliance_records")
    authority = relationship("RegulatoryAuthority", back_populates="compliance_records")

class ComplianceHistory(Base):
    """Histórico de mudanças de compliance"""
    __tablename__ = "compliance_history"
    
    id = Column(Integer, primary_key=True, index=True)
    compliance_record_id = Column(Integer, ForeignKey("compliance_records.id"), nullable=False)
    
    # Change tracking
    previous_status = Column(String(20))
    new_status = Column(String(20), nullable=False)
    previous_score = Column(Float)
    new_score = Column(Float, nullable=False)
    
    # Change metadata
    change_reason = Column(Text)
    changed_by = Column(String(100))
    change_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional data
    notes = Column(Text)

class AuditLog(Base):
    """Log de auditoria para rastreamento de ações no sistema"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Action information
    action = Column(String(50), nullable=False)  # "CREATE", "UPDATE", "DELETE", "QUERY"
    resource_type = Column(String(50), nullable=False)  # "aircraft", "compliance", "authority"
    resource_id = Column(String(50))
    
    # User and system info
    user_agent = Column(String(200))
    ip_address = Column(String(45))
    
    # Request details
    endpoint = Column(String(200))
    method = Column(String(10))
    status_code = Column(Integer)
    
    # Timestamp
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional data
    details = Column(JSON)