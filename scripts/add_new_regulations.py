"""
Script to add specific regulations for new aircraft models E175 and E-Jets E2.
"""

import asyncio
from src.db.session import AsyncSessionLocal
from src.repositories import AuthorityRepository, RegulationRepository


async def add_new_regulations():
    """Add specific regulations for E175 and E-Jets E2 series."""
    print("📋 Adding specific regulations for E175 and E-Jets E2...")
    
    new_regulations = [
        {
            "authority_code": "ANAC",
            "reference": "RBAC 25.841",
            "title": "Pressurization System Requirements - E175",
            "description": "Specific pressurization system requirements for Embraer E175 aircraft",
            "category": "Systems",
            "subcategory": "Pressurization",
            "applicable_models": ["E175"]
        },
        {
            "authority_code": "ANAC",
            "reference": "RBAC 25.1309",
            "title": "Equipment and Systems Installation - E-Jets E2",
            "description": "Updated equipment and systems installation requirements for E-Jets E2 series",
            "category": "Systems",
            "subcategory": "Installation",
            "applicable_models": ["E175-E2", "E190-E2", "E195-E2"]
        },
        {
            "authority_code": "FAA",
            "reference": "14 CFR 25.562",
            "title": "Emergency Landing Conditions - E175",
            "description": "Emergency landing dynamic conditions specific to E175 series aircraft",
            "category": "Structural",
            "subcategory": "Emergency",
            "applicable_models": ["E175", "E175-E2"]
        },
        {
            "authority_code": "FAA",
            "reference": "AD 2025-15-E2",
            "title": "E-Jets E2 Wing Inspection Directive",
            "description": "Mandatory wing inspection requirements for E-Jets E2 series",
            "category": "Airworthiness Directive",
            "subcategory": "Structural",
            "applicable_models": ["E175-E2", "E190-E2", "E195-E2"]
        },
        {
            "authority_code": "EASA",
            "reference": "CS-25.1585",
            "title": "Operating Procedures - E-Jets E2 Series",
            "description": "Operating procedures and limitations for E-Jets E2 series aircraft",
            "category": "Operations",
            "subcategory": "Procedures",
            "applicable_models": ["E175-E2", "E190-E2", "E195-E2"]
        },
        {
            "authority_code": "EASA",
            "reference": "TCDS EASA.IM.A.525",
            "title": "Type Certificate Data Sheet - E175 Series",
            "description": "Type Certificate Data Sheet for Embraer E175 all variants",
            "category": "Certification",
            "subcategory": "Type Certificate",
            "applicable_models": ["E175", "E175-E2"]
        }
    ]
    
    async with AsyncSessionLocal() as session:
        authority_repo = AuthorityRepository(session)
        regulation_repo = RegulationRepository(session)
        
        for reg_data in new_regulations:
            try:
                # Get authority
                authority = await authority_repo.get_by_code(reg_data["authority_code"])
                if not authority:
                    print(f"⚠ Authority {reg_data['authority_code']} not found, skipping...")
                    continue
                
                # Check if regulation already exists
                existing = await regulation_repo.get_by_reference(reg_data["reference"])
                if existing:
                    print(f"⚠ Regulation {reg_data['reference']} already exists")
                    continue
                
                # Create regulation
                regulation_data = {
                    "authority_id": authority.id,
                    "reference": reg_data["reference"],
                    "title": reg_data["title"],
                    "description": reg_data["description"],
                    "category": reg_data["category"],
                    "subcategory": reg_data["subcategory"],
                    "status": "active",
                    "content": {
                        "applicable_models": reg_data["applicable_models"],
                        "model_specific": True,
                        "compliance_requirements": {
                            "inspection_interval": "12 months" if "inspection" in reg_data["title"].lower() else "N/A",
                            "certification_required": "Type Certificate" in reg_data["title"],
                            "mandatory": "AD" in reg_data["reference"]
                        }
                    }
                }
                
                regulation = await regulation_repo.create(**regulation_data)
                models_str = ", ".join(reg_data["applicable_models"])
                print(f"✓ Added: {regulation.reference} - applicable to: {models_str}")
                
            except Exception as e:
                print(f"✗ Error adding regulation {reg_data['reference']}: {e}")
        
        await session.commit()
        print("✅ New regulations added successfully!")


if __name__ == "__main__":
    asyncio.run(add_new_regulations())