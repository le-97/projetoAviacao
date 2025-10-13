#!/usr/bin/env python3
"""
Script para popular o banco de dados com toda a frota Embraer do frontend v2.
Adiciona os 7 modelos faltantes (executivos, defesa e agrícola).
"""

import sqlite3
import uuid
from datetime import datetime

def populate_embraer_fleet():
    """Popula o banco com todos os 15 modelos Embraer."""
    
    print("=" * 80)
    print("✈️  POPULAÇÃO DO BANCO - FROTA COMPLETA EMBRAER")
    print("=" * 80)
    
    conn = sqlite3.connect('projetoaviacao.db')
    cursor = conn.cursor()
    
    # Verificar modelos existentes
    cursor.execute("SELECT model, variant FROM aircraft_models WHERE manufacturer = 'Embraer'")
    existing = [(row[0], row[1]) for row in cursor.fetchall()]
    print(f"\n📊 Modelos existentes no banco: {len(existing)}")
    for model, variant in existing:
        variant_str = f"-{variant}" if variant else ""
        print(f"  ✓ {model}{variant_str}")
    
    # Novos modelos a adicionar (os 7 faltantes)
    new_aircraft = [
        # Aviação Executiva - Phenom
        {
            'manufacturer': 'Embraer',
            'model': 'Phenom 100',
            'variant': 'EV',
            'type_certificate': 'ANAC 2008-13',
            'category': 'Executive Jet',
            'max_seats': 6,
            'max_weight_kg': 4750.0
        },
        {
            'manufacturer': 'Embraer',
            'model': 'Phenom 300',
            'variant': 'E',
            'type_certificate': 'ANAC 2009-05',
            'category': 'Executive Jet',
            'max_seats': 11,
            'max_weight_kg': 8150.0
        },
        
        # Aviação Executiva - Praetor
        {
            'manufacturer': 'Embraer',
            'model': 'Praetor 500',
            'variant': None,
            'type_certificate': 'ANAC 2019-03',
            'category': 'Executive Jet',
            'max_seats': 9,
            'max_weight_kg': 17000.0
        },
        {
            'manufacturer': 'Embraer',
            'model': 'Praetor 600',
            'variant': None,
            'type_certificate': 'ANAC 2019-04',
            'category': 'Executive Jet',
            'max_seats': 12,
            'max_weight_kg': 18100.0
        },
        
        # Defesa e Segurança
        {
            'manufacturer': 'Embraer',
            'model': 'KC-390',
            'variant': 'Millennium',
            'type_certificate': 'ANAC 2018-02',
            'category': 'Military Transport',
            'max_seats': 80,
            'max_weight_kg': 87000.0
        },
        {
            'manufacturer': 'Embraer',
            'model': 'C-390',
            'variant': 'Millennium',
            'type_certificate': 'ANAC 2018-02',
            'category': 'Military Transport',
            'max_seats': 80,
            'max_weight_kg': 87000.0
        },
        {
            'manufacturer': 'Embraer',
            'model': 'A-29',
            'variant': 'Super Tucano',
            'type_certificate': 'ANAC 2003-08',
            'category': 'Military Trainer',
            'max_seats': 2,
            'max_weight_kg': 5400.0
        },
        
        # Aviação Agrícola
        {
            'manufacturer': 'Embraer',
            'model': 'EMB-202',
            'variant': 'Ipanema',
            'type_certificate': 'ANAC 2005-01',
            'category': 'Agricultural',
            'max_seats': 1,
            'max_weight_kg': 1700.0
        },
    ]
    
    print(f"\n📦 Novos modelos a adicionar: {len(new_aircraft)}")
    
    # Inserir novos modelos
    added_count = 0
    for aircraft in new_aircraft:
        # Verificar se já existe
        cursor.execute("""
            SELECT id FROM aircraft_models 
            WHERE model = ? AND variant IS ?
        """, (aircraft['model'], aircraft['variant']))
        
        if cursor.fetchone():
            variant_str = f"-{aircraft['variant']}" if aircraft['variant'] else ""
            print(f"  ⏭️  {aircraft['model']}{variant_str} já existe, pulando...")
            continue
        
        # Inserir novo modelo
        aircraft_id = str(uuid.uuid4())
        now = datetime.now().isoformat()
        
        cursor.execute("""
            INSERT INTO aircraft_models (
                id, manufacturer, model, variant, type_certificate,
                category, max_seats, max_weight_kg, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            aircraft_id,
            aircraft['manufacturer'],
            aircraft['model'],
            aircraft['variant'],
            aircraft['type_certificate'],
            aircraft['category'],
            aircraft['max_seats'],
            aircraft['max_weight_kg'],
            now,
            now
        ))
        
        variant_str = f"-{aircraft['variant']}" if aircraft['variant'] else ""
        print(f"  ✅ {aircraft['model']}{variant_str} ({aircraft['category']}) - {aircraft['max_seats']} assentos")
        added_count += 1
    
    conn.commit()
    
    # Verificar total final
    cursor.execute("SELECT COUNT(*) FROM aircraft_models WHERE manufacturer = 'Embraer'")
    total_embraer = cursor.fetchone()[0]
    
    print(f"\n" + "=" * 80)
    print(f"✅ População concluída!")
    print(f"📊 Modelos Embraer adicionados: {added_count}")
    print(f"📈 Total de modelos Embraer no banco: {total_embraer}")
    print("=" * 80)
    
    # Mostrar resumo por categoria
    print(f"\n📋 RESUMO POR CATEGORIA:")
    cursor.execute("""
        SELECT category, COUNT(*) as count
        FROM aircraft_models 
        WHERE manufacturer = 'Embraer'
        GROUP BY category
        ORDER BY count DESC
    """)
    
    for category, count in cursor.fetchall():
        print(f"  • {category:25} : {count:2} modelos")
    
    # Listar todos os modelos Embraer
    print(f"\n📋 TODOS OS MODELOS EMBRAER:")
    cursor.execute("""
        SELECT model, variant, category, max_seats
        FROM aircraft_models 
        WHERE manufacturer = 'Embraer'
        ORDER BY category, model, variant
    """)
    
    for model, variant, category, seats in cursor.fetchall():
        variant_str = f"-{variant}" if variant else ""
        seats_str = f"{seats:3}" if seats else "N/A"
        print(f"  ✈️  {model:15}{variant_str:15} | {category:25} | {seats_str} assentos")
    
    conn.close()
    
    print(f"\n" + "=" * 80)
    print("🎉 Banco de dados atualizado com sucesso!")
    print("=" * 80)

if __name__ == "__main__":
    populate_embraer_fleet()
