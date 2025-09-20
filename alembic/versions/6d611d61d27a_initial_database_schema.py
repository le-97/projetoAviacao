"""Initial database schema

Revision ID: 6d611d61d27a
Revises: 
Create Date: 2025-09-19 19:07:49.681292

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '6d611d61d27a'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create authorities table
    op.create_table('authorities',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('code', sa.String(10), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('country', sa.String(3), nullable=True),
        sa.Column('website', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )
    op.create_index('ix_authorities_code', 'authorities', ['code'], unique=False)

    # Create aircraft_models table
    op.create_table('aircraft_models',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('manufacturer', sa.String(100), nullable=False),
        sa.Column('model', sa.String(100), nullable=False),
        sa.Column('variant', sa.String(50), nullable=True),
        sa.Column('type_certificate', sa.String(50), nullable=True),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('max_seats', sa.Integer(), nullable=True),
        sa.Column('max_weight_kg', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_aircraft_models_manufacturer', 'aircraft_models', ['manufacturer'], unique=False)
    op.create_index('ix_aircraft_models_model', 'aircraft_models', ['model'], unique=False)
    op.create_index('idx_aircraft_manufacturer_model', 'aircraft_models', ['manufacturer', 'model'], unique=False)

    # Create regulations table
    op.create_table('regulations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('authority_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reference', sa.String(100), nullable=False),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('subcategory', sa.String(100), nullable=True),
        sa.Column('effective_date', sa.DateTime(), nullable=True),
        sa.Column('amendment_number', sa.String(20), nullable=True),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('content', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['authority_id'], ['authorities.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_regulations_reference', 'regulations', ['reference'], unique=False)
    op.create_index('ix_regulations_category', 'regulations', ['category'], unique=False)
    op.create_index('idx_regulation_authority_reference', 'regulations', ['authority_id', 'reference'], unique=False)
    op.create_index('idx_regulation_category', 'regulations', ['category'], unique=False)
    op.create_index('idx_regulation_status', 'regulations', ['status'], unique=False)

    # Create compliance_checks table
    op.create_table('compliance_checks',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('aircraft_model_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('regulation_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('check_date', sa.DateTime(), nullable=False),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('compliance_percentage', sa.Float(), nullable=True),
        sa.Column('details', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('checked_by', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['aircraft_model_id'], ['aircraft_models.id'], ),
        sa.ForeignKeyConstraint(['regulation_id'], ['regulations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_compliance_aircraft_regulation', 'compliance_checks', ['aircraft_model_id', 'regulation_id'], unique=False)
    op.create_index('idx_compliance_check_date', 'compliance_checks', ['check_date'], unique=False)
    op.create_index('idx_compliance_status', 'compliance_checks', ['status'], unique=False)

    # Create compliance_reports table
    op.create_table('compliance_reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('aircraft_model_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('report_date', sa.DateTime(), nullable=False),
        sa.Column('report_type', sa.String(50), nullable=False),
        sa.Column('overall_compliance', sa.Float(), nullable=False),
        sa.Column('total_checks', sa.Integer(), nullable=False),
        sa.Column('compliant_checks', sa.Integer(), nullable=False),
        sa.Column('non_compliant_checks', sa.Integer(), nullable=False),
        sa.Column('not_applicable_checks', sa.Integer(), nullable=False),
        sa.Column('pending_checks', sa.Integer(), nullable=False),
        sa.Column('summary', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('generated_by', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['aircraft_model_id'], ['aircraft_models.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_report_aircraft_date', 'compliance_reports', ['aircraft_model_id', 'report_date'], unique=False)
    op.create_index('idx_report_type', 'compliance_reports', ['report_type'], unique=False)
    op.create_index('idx_report_compliance', 'compliance_reports', ['overall_compliance'], unique=False)

    # Create association tables
    op.create_table('regulation_models',
        sa.Column('regulation_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('aircraft_model_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['aircraft_model_id'], ['aircraft_models.id'], ),
        sa.ForeignKeyConstraint(['regulation_id'], ['regulations.id'], )
    )
    op.create_index('idx_regulation_models_regulation', 'regulation_models', ['regulation_id'], unique=False)
    op.create_index('idx_regulation_models_model', 'regulation_models', ['aircraft_model_id'], unique=False)

    op.create_table('report_checks',
        sa.Column('report_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('check_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['check_id'], ['compliance_checks.id'], ),
        sa.ForeignKeyConstraint(['report_id'], ['compliance_reports.id'], )
    )
    op.create_index('idx_report_checks_report', 'report_checks', ['report_id'], unique=False)
    op.create_index('idx_report_checks_check', 'report_checks', ['check_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('report_checks')
    op.drop_table('regulation_models')
    op.drop_table('compliance_reports')
    op.drop_table('compliance_checks')
    op.drop_table('regulations')
    op.drop_table('aircraft_models')
    op.drop_table('authorities')
