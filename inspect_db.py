#!/usr/bin/env python3
"""Script para inspecionar o banco de dados de conformidade."""

import sqlite3
import json

def inspect_database():
    """Inspeciona o banco de dados projetoaviacao.db"""
    
    print("=" * 80)
    print("🔍 INSPEÇÃO DO BANCO DE DADOS DE CONFORMIDADE")
    print("=" * 80)
    
    # Conectar ao banco
    conn = sqlite3.connect('projetoaviacao.db')
    cursor = conn.cursor()
    
    # Listar todas as tabelas
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    
    print("\n📊 TABELAS ENCONTRADAS:")
    print("-" * 80)
    for table in tables:
        table_name = table[0]
        print(f"\n✈️  {table_name}")
        
        # Obter estrutura da tabela
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        
        print("   Colunas:")
        for col in columns:
            col_name = col[1]
            col_type = col[2]
            print(f"     - {col_name} ({col_type})")
        
        # Contar registros
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"   📈 Total de registros: {count}")
        
        # Mostrar alguns exemplos se houver dados
        if count > 0 and count <= 5:
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
            rows = cursor.fetchall()
            print(f"   📋 Exemplos:")
            for row in rows:
                print(f"      {row}")
    
    # Informações específicas sobre aeronaves
    print("\n" + "=" * 80)
    print("✈️  DETALHES DAS AERONAVES")
    print("=" * 80)
    
    cursor.execute("""
        SELECT model, variant, manufacturer, category, max_seats 
        FROM aircraft_models 
        ORDER BY manufacturer, model, variant
    """)
    
    aircraft_list = cursor.fetchall()
    
    print(f"\n📋 Total de modelos: {len(aircraft_list)}")
    print("\nLista completa:")
    for aircraft in aircraft_list:
        model = aircraft[0]
        variant = aircraft[1] if aircraft[1] else ""
        manufacturer = aircraft[2]
        category = aircraft[3]
        seats = aircraft[4] if aircraft[4] else "N/A"
        
        full_name = f"{model}"
        if variant:
            full_name += f"-{variant}"
        
        print(f"  • {manufacturer} {full_name:20} | {category:20} | {seats:>3} assentos")
    
    # Informações sobre autoridades
    print("\n" + "=" * 80)
    print("🏛️  AUTORIDADES REGULADORAS")
    print("=" * 80)
    
    cursor.execute("SELECT name, country FROM authorities ORDER BY country")
    authorities = cursor.fetchall()
    
    print(f"\n📋 Total de autoridades: {len(authorities)}")
    for auth in authorities:
        print(f"  • {auth[0]:30} | {auth[1]}")
    
    # Informações sobre regulamentações
    print("\n" + "=" * 80)
    print("📜 REGULAMENTAÇÕES")
    print("=" * 80)
    
    cursor.execute("""
        SELECT r.reference, r.title, a.name 
        FROM regulations r 
        JOIN authorities a ON r.authority_id = a.id 
        LIMIT 10
    """)
    regulations = cursor.fetchall()
    
    print(f"\n📋 Exemplos de regulamentações (primeiras 10):")
    for reg in regulations:
        code = reg[0]
        title = reg[1][:50] + "..." if len(reg[1]) > 50 else reg[1]
        authority = reg[2]
        print(f"  • {code:15} | {authority:20} | {title}")
    
    conn.close()
    
    print("\n" + "=" * 80)
    print("✅ Inspeção concluída!")
    print("=" * 80)

if __name__ == "__main__":
    inspect_database()
