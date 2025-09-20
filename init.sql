-- Initialize database with required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_authorities_country ON authorities(country);
CREATE INDEX IF NOT EXISTS idx_aircraft_models_manufacturer ON aircraft_models(manufacturer);
CREATE INDEX IF NOT EXISTS idx_regulations_authority ON regulations(authority_id);
CREATE INDEX IF NOT EXISTS idx_regulations_category ON regulations(category);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_aircraft ON compliance_checks(aircraft_model_id);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_check ON compliance_reports(compliance_check_id);