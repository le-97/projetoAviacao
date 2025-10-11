"""
Script para popular o banco de dados com todos os modelos de aeronaves Embraer.

Este script adiciona informações completas de todas as aeronaves Embraer:
- Aviação Comercial (E-Jets e E-Jets E2)
- Aviação Executiva (Phenom e Praetor)
- Defesa & Segurança (KC-390, Super Tucano)
- Aviação Agrícola (Ipanema)
"""

import asyncio
from datetime import datetime
from uuid import uuid4
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from src.models.db_models_sqlite import Base, AircraftModel

# Configuração do banco de dados
DATABASE_URL = "sqlite+aiosqlite:///./aviation_compliance.db"

# Dados completos das aeronaves Embraer
EMBRAER_AIRCRAFT = [
    # ===== AVIAÇÃO COMERCIAL - E-JETS E2 (NOVA GERAÇÃO) =====
    {
        "manufacturer": "Embraer",
        "model": "E175-E2",
        "variant": None,
        "type_certificate": "TC-E175E2",
        "category": "commercial",
        "max_seats": 90,
        "max_weight_kg": 44990,
        "specs": {
            "description": "E-Jet de segunda geração com capacidade para 80-90 passageiros",
            "capacity": {"min": 80, "max": 90, "configuration": "2+2 sem assento do meio"},
            "range": {"value": 3700, "unit": "km", "nm": 2000},
            "cruise_speed": {"mach": 0.82, "kmh": 870},
            "max_speed": {"mach": 0.82, "kmh": 870},
            "engines": {
                "type": "Pratt & Whitney PW1700G",
                "count": 2,
                "thrust_per_engine": "14,000 lbf"
            },
            "dimensions": {
                "length": "31.68 m",
                "wingspan": "31.24 m",
                "height": "9.73 m"
            },
            "performance": {
                "ceiling": "41,000 ft",
                "takeoff_distance": "1,650 m",
                "fuel_efficiency": "29% melhor que geração anterior por assento"
            },
            "cabin": {
                "width": "2.74 m",
                "height": "2.06 m",
                "configuration": "2+2",
                "wifi": True,
                "hepa_filters": True
            },
            "status": "em_desenvolvimento",
            "first_flight": None,
            "entry_into_service": "TBD"
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "E190-E2",
        "variant": None,
        "type_certificate": "TC-E190E2",
        "category": "commercial",
        "max_seats": 114,
        "max_weight_kg": 56200,
        "specs": {
            "description": "Jato regional de segunda geração com eficiência excepcional",
            "capacity": {"min": 97, "max": 114, "configuration": "2+2 sem assento do meio"},
            "range": {"value": 5278, "unit": "km", "nm": 2850},
            "cruise_speed": {"mach": 0.82, "kmh": 870},
            "max_speed": {"mach": 0.82, "kmh": 870},
            "engines": {
                "type": "Pratt & Whitney PW1919G",
                "count": 2,
                "thrust_per_engine": "19,000 lbf"
            },
            "dimensions": {
                "length": "36.24 m",
                "wingspan": "33.72 m",
                "height": "10.28 m"
            },
            "performance": {
                "ceiling": "41,000 ft",
                "takeoff_distance": "1,644 m",
                "fuel_efficiency": "29% melhor por assento vs E190",
                "noise_reduction": "68% vs geração anterior",
                "emissions": "Capítulo 14 ICAO compliant"
            },
            "cabin": {
                "width": "2.74 m",
                "height": "2.06 m",
                "configuration": "2+2",
                "overhead_bins_increase": "90%",
                "wifi": True,
                "hepa_filters": True,
                "air_renewal": "20 vezes por hora"
            },
            "status": "em_operacao",
            "first_flight": "2016-05-23",
            "entry_into_service": "2018-04-03",
            "certifications": ["FAA", "EASA", "ANAC"]
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "E195-E2",
        "variant": None,
        "type_certificate": "TC-E195E2",
        "category": "commercial",
        "max_seats": 146,
        "max_weight_kg": 62500,
        "specs": {
            "description": "O maior da família E2, com capacidade até 146 passageiros",
            "capacity": {"min": 120, "max": 146, "configuration": "2+2 sem assento do meio"},
            "range": {"value": 5556, "unit": "km", "nm": 3000},
            "cruise_speed": {"mach": 0.82, "kmh": 870},
            "max_speed": {"mach": 0.82, "kmh": 870},
            "engines": {
                "type": "Pratt & Whitney PW1923G",
                "count": 2,
                "thrust_per_engine": "23,000 lbf"
            },
            "dimensions": {
                "length": "41.50 m",
                "wingspan": "35.10 m",
                "height": "10.88 m"
            },
            "performance": {
                "ceiling": "41,000 ft",
                "takeoff_distance": "1,788 m",
                "fuel_efficiency": "29% melhor por assento",
                "noise_reduction": "68% vs geração anterior",
                "missions_coverage": "99.9% das missões até 150 assentos dentro do alcance"
            },
            "cabin": {
                "width": "2.74 m",
                "height": "2.06 m",
                "configuration": "2+2",
                "executive_config": "staggered 2+2",
                "overhead_bins_increase": "90%",
                "wifi": True,
                "streaming": True,
                "hepa_filters": True,
                "hepa_efficiency": "99.7%",
                "air_renewal": "20+ vezes por hora",
                "power_outlets": True
            },
            "status": "em_operacao",
            "first_flight": "2017-03-28",
            "entry_into_service": "2019-09-09",
            "certifications": ["FAA", "EASA", "ANAC"],
            "awards": ["Mais silencioso da categoria de corredor único"]
        }
    },
    
    # ===== AVIAÇÃO COMERCIAL - E-JETS (GERAÇÃO ANTERIOR) =====
    {
        "manufacturer": "Embraer",
        "model": "E170",
        "variant": None,
        "type_certificate": "TC-E170",
        "category": "commercial",
        "max_seats": 80,
        "max_weight_kg": 38600,
        "specs": {
            "description": "Jato regional de primeira geração",
            "capacity": {"min": 70, "max": 80, "configuration": "2+2"},
            "range": {"value": 3700, "unit": "km", "nm": 2000},
            "cruise_speed": {"mach": 0.78, "kmh": 829},
            "engines": {
                "type": "GE CF34-8E",
                "count": 2,
                "thrust_per_engine": "14,200 lbf"
            },
            "dimensions": {
                "length": "29.90 m",
                "wingspan": "26.00 m",
                "height": "9.70 m"
            },
            "status": "em_operacao",
            "entry_into_service": "2004",
            "certifications": ["FAA", "EASA", "ANAC"]
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "E175",
        "variant": None,
        "type_certificate": "TC-E175",
        "category": "commercial",
        "max_seats": 88,
        "max_weight_kg": 40370,
        "specs": {
            "description": "Versão estendida do E170",
            "capacity": {"min": 78, "max": 88, "configuration": "2+2"},
            "range": {"value": 3900, "unit": "km", "nm": 2100},
            "cruise_speed": {"mach": 0.78, "kmh": 829},
            "engines": {
                "type": "GE CF34-8E",
                "count": 2,
                "thrust_per_engine": "14,200 lbf"
            },
            "dimensions": {
                "length": "31.68 m",
                "wingspan": "26.00 m",
                "height": "9.73 m"
            },
            "status": "em_operacao",
            "entry_into_service": "2005",
            "certifications": ["FAA", "EASA", "ANAC"],
            "notes": "Aeronave muito popular em mercado regional norte-americano"
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "E190",
        "variant": None,
        "type_certificate": "TC-E190",
        "category": "commercial",
        "max_seats": 114,
        "max_weight_kg": 51800,
        "specs": {
            "description": "Jato regional de primeira geração - versão maior",
            "capacity": {"min": 96, "max": 114, "configuration": "2+2"},
            "range": {"value": 4800, "unit": "km", "nm": 2600},
            "cruise_speed": {"mach": 0.82, "kmh": 870},
            "engines": {
                "type": "GE CF34-10E",
                "count": 2,
                "thrust_per_engine": "18,500 lbf"
            },
            "dimensions": {
                "length": "36.24 m",
                "wingspan": "28.72 m",
                "height": "10.28 m"
            },
            "status": "em_operacao",
            "entry_into_service": "2005",
            "certifications": ["FAA", "EASA", "ANAC"]
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "E195",
        "variant": None,
        "type_certificate": "TC-E195",
        "category": "commercial",
        "max_seats": 124,
        "max_weight_kg": 52290,
        "specs": {
            "description": "O maior da família E-Jets de primeira geração",
            "capacity": {"min": 108, "max": 124, "configuration": "2+2"},
            "range": {"value": 4200, "unit": "km", "nm": 2270},
            "cruise_speed": {"mach": 0.82, "kmh": 870},
            "engines": {
                "type": "GE CF34-10E",
                "count": 2,
                "thrust_per_engine": "18,500 lbf"
            },
            "dimensions": {
                "length": "38.65 m",
                "wingspan": "28.72 m",
                "height": "10.28 m"
            },
            "status": "em_operacao",
            "entry_into_service": "2006",
            "certifications": ["FAA", "EASA", "ANAC"]
        }
    },
    
    # ===== AVIAÇÃO EXECUTIVA - PHENOM =====
    {
        "manufacturer": "Embraer",
        "model": "Phenom 100EX",
        "variant": "EX",
        "type_certificate": "TC-P100EX",
        "category": "executive",
        "max_seats": 6,
        "max_weight_kg": 4850,
        "specs": {
            "description": "Very Light Jet com tecnologia avançada",
            "capacity": {"min": 4, "max": 6, "executive_config": True},
            "range": {"value": 2182, "unit": "km", "nm": 1178},
            "cruise_speed": {"kmh": 732, "knots": 395},
            "max_speed": {"kmh": 732, "knots": 395},
            "engines": {
                "type": "Pratt & Whitney Canada PW617F1-E",
                "count": 2,
                "thrust_per_engine": "1,730 lbf"
            },
            "dimensions": {
                "length": "12.82 m",
                "wingspan": "12.30 m",
                "height": "4.35 m"
            },
            "performance": {
                "ceiling": "41,000 ft",
                "takeoff_distance": "1,000 m",
                "landing_distance": "734 m"
            },
            "cabin": {
                "length": "3.60 m",
                "width": "1.55 m",
                "height": "1.50 m",
                "volume": "5.1 m³",
                "baggage": "0.84 m³"
            },
            "avionics": "Prodigy Touch Flight Deck by Garmin",
            "status": "em_producao",
            "certifications": ["FAA", "EASA", "ANAC"]
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "Phenom 300E",
        "variant": "E",
        "type_certificate": "TC-P300E",
        "category": "executive",
        "max_seats": 9,
        "max_weight_kg": 8273,
        "specs": {
            "description": "Light Jet mais vendido do mundo por 11 anos consecutivos",
            "capacity": {"min": 6, "max": 9, "executive_config": True},
            "range": {"value": 3650, "unit": "km", "nm": 1971},
            "cruise_speed": {"kmh": 839, "knots": 453},
            "max_speed": {"kmh": 839, "knots": 453},
            "engines": {
                "type": "Pratt & Whitney Canada PW535E1",
                "count": 2,
                "thrust_per_engine": "3,360 lbf"
            },
            "dimensions": {
                "length": "15.90 m",
                "wingspan": "16.00 m",
                "height": "5.08 m"
            },
            "performance": {
                "ceiling": "45,000 ft",
                "takeoff_distance": "1,036 m",
                "landing_distance": "820 m",
                "climb_rate": "3,484 ft/min"
            },
            "cabin": {
                "length": "5.26 m",
                "width": "1.55 m",
                "height": "1.55 m",
                "volume": "8.4 m³",
                "baggage": "0.93 m³"
            },
            "avionics": "Prodigy Touch Flight Deck by Garmin G3000",
            "features": [
                "Single-pilot certified",
                "Lower cabin altitude",
                "Bossa Nova interior"
            ],
            "status": "em_producao",
            "certifications": ["FAA", "EASA", "ANAC"],
            "awards": ["Jato leve mais vendido do mundo (2011-2022)"]
        }
    },
    
    # ===== AVIAÇÃO EXECUTIVA - PRAETOR =====
    {
        "manufacturer": "Embraer",
        "model": "Praetor 500",
        "variant": None,
        "type_certificate": "TC-PR500",
        "category": "executive",
        "max_seats": 9,
        "max_weight_kg": 17640,
        "specs": {
            "description": "Midsize jet com alcance de super-midsize",
            "capacity": {"min": 7, "max": 9, "executive_config": True},
            "range": {"value": 6019, "unit": "km", "nm": 3250},
            "cruise_speed": {"kmh": 863, "knots": 466, "mach": 0.80},
            "max_speed": {"mach": 0.83, "kmh": 882},
            "engines": {
                "type": "Honeywell HTF7500E",
                "count": 2,
                "thrust_per_engine": "6,540 lbf"
            },
            "dimensions": {
                "length": "20.74 m",
                "wingspan": "21.50 m",
                "height": "6.43 m"
            },
            "performance": {
                "ceiling": "45,000 ft",
                "takeoff_distance": "1,365 m",
                "landing_distance": "762 m",
                "full_fly_by_wire": True
            },
            "cabin": {
                "length": "8.50 m",
                "width": "2.08 m",
                "height": "1.83 m",
                "volume": "19.8 m³",
                "baggage": "3.8 m³"
            },
            "avionics": "Collins Aerospace Pro Line Fusion",
            "features": [
                "Full fly-by-wire",
                "Turbulence reduction",
                "Ka-band connectivity",
                "Lower cabin altitude (5,800 ft at 45,000 ft)"
            ],
            "status": "em_producao",
            "entry_into_service": "2019",
            "certifications": ["FAA", "EASA", "ANAC"]
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "Praetor 600",
        "variant": None,
        "type_certificate": "TC-PR600",
        "category": "executive",
        "max_seats": 12,
        "max_weight_kg": 22000,
        "specs": {
            "description": "Super-midsize com maior alcance da categoria",
            "capacity": {"min": 8, "max": 12, "executive_config": True},
            "range": {"value": 7778, "unit": "km", "nm": 4200},
            "cruise_speed": {"kmh": 863, "knots": 466, "mach": 0.80},
            "max_speed": {"mach": 0.83, "kmh": 882},
            "engines": {
                "type": "Honeywell HTF7500E",
                "count": 2,
                "thrust_per_engine": "7,528 lbf"
            },
            "dimensions": {
                "length": "21.50 m",
                "wingspan": "21.50 m",
                "height": "6.43 m"
            },
            "performance": {
                "ceiling": "45,000 ft",
                "takeoff_distance": "1,444 m",
                "landing_distance": "805 m",
                "full_fly_by_wire": True
            },
            "cabin": {
                "length": "10.40 m",
                "width": "2.08 m",
                "height": "1.83 m",
                "volume": "23.7 m³",
                "baggage": "5.0 m³"
            },
            "avionics": "Collins Aerospace Pro Line Fusion",
            "features": [
                "Full fly-by-wire",
                "Turbulence reduction",
                "Ka-band connectivity",
                "Lower cabin altitude (5,800 ft at 45,000 ft)",
                "Maior alcance da categoria",
                "Banheiro com janela"
            ],
            "status": "em_producao",
            "entry_into_service": "2019",
            "certifications": ["FAA", "EASA", "ANAC"],
            "records": ["Maior alcance da categoria super-midsize"]
        }
    },
    
    # ===== DEFESA & SEGURANÇA =====
    {
        "manufacturer": "Embraer",
        "model": "KC-390",
        "variant": "Millennium",
        "type_certificate": "TC-KC390",
        "category": "defense",
        "max_seats": 80,
        "max_weight_kg": 87000,
        "specs": {
            "description": "Aeronave de transporte militar multimissão",
            "capacity": {
                "troops": 80,
                "paratroopers": 66,
                "cargo": "26,000 kg",
                "medical_evacuation": 74
            },
            "range": {"value": 5900, "unit": "km", "nm": 3190},
            "cruise_speed": {"kmh": 870, "knots": 470, "mach": 0.80},
            "max_speed": {"kmh": 870, "mach": 0.80},
            "engines": {
                "type": "International Aero Engines V2500-E5",
                "count": 2,
                "thrust_per_engine": "31,330 lbf"
            },
            "dimensions": {
                "length": "35.20 m",
                "wingspan": "35.05 m",
                "height": "11.84 m"
            },
            "performance": {
                "ceiling": "36,000 ft",
                "takeoff_distance": "1,350 m",
                "landing_distance": "900 m"
            },
            "cargo_hold": {
                "length": "18.50 m",
                "width": "3.45 m",
                "height": "2.95 m",
                "volume": "169 m³"
            },
            "missions": [
                "Transporte tático de carga",
                "Transporte de tropas",
                "Lançamento de paraquedistas",
                "Reabastecimento aéreo",
                "Evacuação médica",
                "Combate a incêndios",
                "Busca e salvamento"
            ],
            "features": [
                "Rampa traseira para carga",
                "Sistema de reabastecimento aéreo",
                "Operação em pistas não preparadas",
                "Fly-by-wire"
            ],
            "status": "em_operacao",
            "first_flight": "2015-02-03",
            "entry_into_service": "2019",
            "operators": ["Força Aérea Brasileira", "Força Aérea Portuguesa", "Força Aérea Húngara"]
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "EMB-314",
        "variant": "Super Tucano",
        "type_certificate": "TC-EMB314",
        "category": "defense",
        "max_seats": 2,
        "max_weight_kg": 5400,
        "specs": {
            "description": "Aeronave de ataque leve e treinamento avançado",
            "capacity": {"crew": 2, "pilot_and_instructor": True},
            "range": {"value": 720, "unit": "km", "combat": True},
            "ferry_range": {"value": 2520, "unit": "km", "with_external_tanks": True},
            "cruise_speed": {"kmh": 520, "knots": 280},
            "max_speed": {"kmh": 590, "knots": 320},
            "engines": {
                "type": "Pratt & Whitney Canada PT6A-68C",
                "count": 1,
                "power": "1,600 shp"
            },
            "dimensions": {
                "length": "11.38 m",
                "wingspan": "11.14 m",
                "height": "3.97 m"
            },
            "performance": {
                "ceiling": "35,000 ft",
                "climb_rate": "2,470 ft/min",
                "g_limits": "+7/-3.5"
            },
            "armament": {
                "internal_guns": "2x 12.7mm machine guns",
                "hardpoints": 5,
                "max_ordnance": "1,550 kg",
                "weapons": [
                    "Foguetes não guiados",
                    "Bombas",
                    "Mísseis ar-ar",
                    "Mísseis ar-superfície",
                    "Pods de canhão"
                ]
            },
            "missions": [
                "Ataque leve",
                "Reconhecimento",
                "Patrulha de fronteira",
                "Contrainsurgência",
                "Treinamento avançado",
                "Apoio aéreo aproximado"
            ],
            "status": "em_producao",
            "first_flight": "1999-06-02",
            "entry_into_service": "2003",
            "operators": [
                "Força Aérea Brasileira",
                "US Air Force",
                "15+ países"
            ],
            "notes": "Mais de 260 unidades entregues mundialmente"
        }
    },
    {
        "manufacturer": "Embraer",
        "model": "P-99",
        "variant": None,
        "type_certificate": "TC-P99",
        "category": "defense",
        "max_seats": 4,
        "max_weight_kg": 23000,
        "specs": {
            "description": "Aeronave de patrulha marítima baseada no EMB-145",
            "capacity": {"crew": 4, "mission_crew": "até 10"},
            "range": {"value": 5000, "unit": "km", "nm": 2700},
            "endurance": {"hours": 8, "patrol": True},
            "cruise_speed": {"kmh": 833, "knots": 450},
            "engines": {
                "type": "Rolls-Royce AE 3007",
                "count": 2
            },
            "sensors": [
                "Radar de busca marítima",
                "Sistema eletro-óptico/infravermelho",
                "Sistema de guerra eletrônica",
                "Sistema acústico"
            ],
            "missions": [
                "Patrulha marítima",
                "Vigilância costeira",
                "Busca e salvamento (SAR)",
                "Combate ao narcotráfico",
                "Controle de poluição"
            ],
            "status": "em_operacao",
            "operators": ["Força Aérea Brasileira", "Marinha do Brasil"]
        }
    },
    
    # ===== AVIAÇÃO AGRÍCOLA =====
    {
        "manufacturer": "Embraer",
        "model": "EMB-202",
        "variant": "Ipanema",
        "type_certificate": "TC-IPANEMA",
        "category": "agriculture",
        "max_seats": 1,
        "max_weight_kg": 1800,
        "specs": {
            "description": "Único avião agrícola certificado para voar com etanol 100%",
            "capacity": {
                "pilot": 1,
                "chemical_hopper": "900 litros",
                "fuel": "93 litros (etanol ou gasolina)"
            },
            "range": {"value": 600, "unit": "km", "operational": True},
            "cruise_speed": {"kmh": 185, "knots": 100},
            "engines": {
                "type": "Lycoming IO-540-K1J5",
                "count": 1,
                "power": "300 hp",
                "fuel_options": ["Etanol hidratado", "Gasolina de aviação"]
            },
            "dimensions": {
                "length": "7.43 m",
                "wingspan": "11.69 m",
                "height": "2.20 m"
            },
            "performance": {
                "ceiling": "12,500 ft",
                "stall_speed": "91 kmh",
                "takeoff_distance": "260 m",
                "landing_distance": "220 m"
            },
            "spray_system": {
                "capacity": "900 litros",
                "boom_width": "10-14 metros",
                "application_rate": "variável"
            },
            "features": [
                "Único certificado ANAC para etanol",
                "Estrutura reforçada para agroquímicos",
                "Cockpit ergonômico",
                "Baixo custo operacional",
                "Sustentável (biocombustível)"
            ],
            "status": "em_producao",
            "first_flight": "1970",
            "entry_into_service": "1972",
            "history": "5 décadas em operação",
            "certifications": ["ANAC"],
            "notes": "Símbolo tecnológico da agricultura brasileira, produzido em série há mais de 50 anos"
        }
    }
]


async def populate_database():
    """Popular o banco de dados com aeronaves Embraer."""
    
    # Criar engine e session
    engine = create_async_engine(DATABASE_URL, echo=True)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    # Criar tabelas
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Adicionar aeronaves
    async with async_session() as session:
        try:
            # Verificar se já existem aeronaves Embraer
            result = await session.execute(
                select(AircraftModel).where(AircraftModel.manufacturer == "Embraer")
            )
            existing = result.scalars().all()
            
            if existing:
                print(f"\n⚠️  Já existem {len(existing)} aeronaves Embraer no banco de dados.")
                response = input("Deseja substituir? (s/n): ")
                if response.lower() != 's':
                    print("Operação cancelada.")
                    return
                
                # Remover aeronaves existentes
                for aircraft in existing:
                    await session.delete(aircraft)
                await session.commit()
                print(f"✅ {len(existing)} aeronaves removidas.")
            
            # Adicionar novas aeronaves
            print(f"\n🚀 Adicionando {len(EMBRAER_AIRCRAFT)} aeronaves Embraer...")
            
            for aircraft_data in EMBRAER_AIRCRAFT:
                aircraft = AircraftModel(
                    id=str(uuid4()),
                    manufacturer=aircraft_data["manufacturer"],
                    model=aircraft_data["model"],
                    variant=aircraft_data.get("variant"),
                    type_certificate=aircraft_data.get("type_certificate"),
                    category=aircraft_data["category"],
                    max_seats=aircraft_data.get("max_seats"),
                    max_weight_kg=aircraft_data.get("max_weight_kg"),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                
                # Adicionar especificações como JSON
                if "specs" in aircraft_data:
                    # O campo specs será armazenado automaticamente como JSON
                    pass
                
                session.add(aircraft)
                print(f"  ✓ {aircraft_data['model']} ({aircraft_data['category']})")
            
            await session.commit()
            print(f"\n✅ Total de {len(EMBRAER_AIRCRAFT)} aeronaves Embraer adicionadas com sucesso!")
            
            # Estatísticas
            stats = {}
            for aircraft in EMBRAER_AIRCRAFT:
                category = aircraft["category"]
                stats[category] = stats.get(category, 0) + 1
            
            print("\n📊 Estatísticas:")
            category_names = {
                "commercial": "Aviação Comercial",
                "executive": "Aviação Executiva",
                "defense": "Defesa & Segurança",
                "agriculture": "Aviação Agrícola"
            }
            for category, count in stats.items():
                print(f"  • {category_names.get(category, category)}: {count} modelos")
            
        except Exception as e:
            await session.rollback()
            print(f"\n❌ Erro ao popular banco de dados: {e}")
            raise
    
    await engine.dispose()


if __name__ == "__main__":
    print("=" * 70)
    print("  POPULADOR DE AERONAVES EMBRAER")
    print("  Sistema de Compliance de Aviação")
    print("=" * 70)
    
    asyncio.run(populate_database())
    
    print("\n" + "=" * 70)
    print("  ✈️  Banco de dados populado com sucesso!")
    print("=" * 70)
