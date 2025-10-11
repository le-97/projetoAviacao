"""Visualização rápida dos modelos Embraer no banco."""
import sqlite3

conn = sqlite3.connect('aviation_compliance.db')
cursor = conn.cursor()

cursor.execute('''
    SELECT model, category, max_seats, max_weight_kg 
    FROM aircraft_models 
    ORDER BY category, model
''')

rows = cursor.fetchall()

print('\n' + '='*90)
print('  MODELOS EMBRAER NO BANCO DE DADOS')
print('='*90 + '\n')
print(f'{"MODELO":<20} | {"CATEGORIA":<12} | {"PASSAGEIROS":<15} | {"PESO MÁXIMO":<15}')
print('-'*90)

for row in rows:
    model = row[0]
    category = row[1]
    seats = f"{row[2]} assentos" if row[2] else "N/A"
    weight = f"{int(row[3])} kg" if row[3] else "N/A"
    print(f'{model:<20} | {category:<12} | {seats:<15} | {weight:<15}')

print('\n' + '='*90)
print(f'\nTotal: {len(rows)} aeronaves Embraer')
print('='*90 + '\n')

conn.close()
