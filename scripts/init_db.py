"""
Script to initialize the database with sample data for Aviation Compliance API.
"""

import asyncio
import sys
import os

# Add the src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from database import create_tables, AsyncSessionLocal
from sqlalchemy import text


async def init_sample_data():
    """Initialize database with sample aviation data."""
    
    # Sample aircraft data - The 8 aircraft models mentioned in the completion report
    aircraft_data = [
        {
            "model": "E175-E1",
            "manufacturer": "Embraer",
            "variant": "E1",
            "type_certificate": "A57NM",
            "max_seats": 88,
            "max_weight_kg": 38790
        },
        {
            "model": "E175-E2",
            "manufacturer": "Embraer", 
            "variant": "E2",
            "type_certificate": "A57NM",
            "max_seats": 88,
            "max_weight_kg": 38100
        },
        {
            "model": "E190-E1",
            "manufacturer": "Embraer",
            "variant": "E1", 
            "type_certificate": "A57NM",
            "max_seats": 114,
            "max_weight_kg": 51800
        },
        {
            "model": "E190-E2",
            "manufacturer": "Embraer",
            "variant": "E2",
            "type_certificate": "A57NM", 
            "max_seats": 114,
            "max_weight_kg": 56200
        },
        {
            "model": "E195-E1",
            "manufacturer": "Embraer",
            "variant": "E1",
            "type_certificate": "A57NM",
            "max_seats": 124,
            "max_weight_kg": 52290
        },
        {
            "model": "E195-E2",
            "manufacturer": "Embraer",
            "variant": "E2", 
            "type_certificate": "A57NM",
            "max_seats": 124,
            "max_weight_kg": 61500
        },
        {
            "model": "A320",
            "manufacturer": "Airbus",
            "variant": None,
            "type_certificate": "EASA.A.064",
            "max_seats": 180,
            "max_weight_kg": 78000
        },
        {
            "model": "737",
            "manufacturer": "Boeing",
            "variant": "800",
            "type_certificate": "A16WE",
            "max_seats": 189,
            "max_weight_kg": 79010
        }
    ]
    
    # Sample regulations data
    regulations_data = [
        {
            "authority": "ANAC",
            "description": "RBAC 21 - Certificação de Produto Aeronáutico",
            "applicable_models": "E175-E1,E175-E2,E190-E1,E190-E2,E195-E1,E195-E2"
        },
        {
            "authority": "ANAC", 
            "description": "RBAC 91 - Requisitos Gerais de Operação para Aeronaves Civis",
            "applicable_models": "E175-E1,E175-E2,E190-E1,E190-E2,E195-E1,E195-E2,A320,737"
        },
        {
            "authority": "FAA",
            "description": "TCDS A57NM - Embraer ERJ Family",
            "applicable_models": "E175-E1,E175-E2,E190-E1,E190-E2,E195-E1,E195-E2"
        },
        {
            "authority": "FAA",
            "description": "AD-2025-12: Wing inspection required for Embraer E-Jets",
            "applicable_models": "E190-E1,E190-E2"
        },
        {
            "authority": "EASA",
            "description": "TCDS EASA.IM.A.071 - ERJ Family",
            "applicable_models": "E175-E1,E175-E2,E190-E1,E190-E2,E195-E1,E195-E2"
        },
        {
            "authority": "EASA",
            "description": "TCDS EASA.A.064 - Airbus A320 Family",
            "applicable_models": "A320"
        },
        {
            "authority": "FAA", 
            "description": "TCDS A16WE - Boeing 737",
            "applicable_models": "737"
        }
    ]
    
    async with AsyncSessionLocal() as session:
        try:
            # Create aircraft table if not exists
            await session.execute(text("""
                CREATE TABLE IF NOT EXISTS aircraft (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    model VARCHAR(50) NOT NULL UNIQUE,
                    manufacturer VARCHAR(100) NOT NULL,
                    variant VARCHAR(50),
                    type_certificate VARCHAR(100),
                    max_seats INTEGER,
                    max_weight_kg FLOAT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # Create regulations table if not exists
            await session.execute(text("""
                CREATE TABLE IF NOT EXISTS regulations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    authority VARCHAR(50) NOT NULL,
                    description TEXT NOT NULL,
                    applicable_models TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # Insert aircraft data
            for aircraft in aircraft_data:
                await session.execute(text("""
                    INSERT OR IGNORE INTO aircraft (model, manufacturer, variant, type_certificate, max_seats, max_weight_kg)
                    VALUES (:model, :manufacturer, :variant, :type_certificate, :max_seats, :max_weight_kg)
                """), aircraft)
            
            # Insert regulations data
            for regulation in regulations_data:
                await session.execute(text("""
                    INSERT OR IGNORE INTO regulations (authority, description, applicable_models)
                    VALUES (:authority, :description, :applicable_models)
                """), regulation)
            
            await session.commit()
            print("✅ Database initialized successfully with aviation data!")
            print(f"✅ Inserted {len(aircraft_data)} aircraft models")
            print(f"✅ Inserted {len(regulations_data)} regulations")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Error initializing database: {e}")
            raise


async def main():
    """Main function to create tables and initialize data."""
    print("🚀 Initializing Aviation Compliance API database...")
    
    # Create tables first
    await create_tables()
    print("✅ Database tables created")
    
    # Initialize with sample data
    await init_sample_data()
    
    print("🎉 Database initialization completed!")


if __name__ == "__main__":
    asyncio.run(main())