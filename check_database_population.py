import sqlite3
import os

def check_database(db_file):
    if not os.path.exists(db_file):
        print(f"{db_file} não encontrado")
        return
    
    print(f"\n=== Analisando {db_file} ===")
    print(f"Tamanho: {os.path.getsize(db_file)} bytes")
    
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Listar tabelas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        if not tables:
            print("Banco vazio - nenhuma tabela encontrada")
            conn.close()
            return
            
        print(f"Tabelas encontradas: {[table[0] for table in tables]}")
        
        # Para cada tabela, contar registros
        for table in tables:
            table_name = table[0]
            if not table_name.startswith('sqlite_'):
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                    count = cursor.fetchone()[0]
                    print(f"  {table_name}: {count} registros")
                    
                    # Mostrar estrutura da tabela
                    cursor.execute(f"PRAGMA table_info({table_name})")
                    columns = cursor.fetchall()
                    print(f"    Colunas: {[col[1] for col in columns]}")
                    
                    # Mostrar alguns registros se existirem
                    if count > 0 and count <= 10:
                        cursor.execute(f"SELECT * FROM {table_name} LIMIT 3")
                        rows = cursor.fetchall()
                        print(f"    Primeiros registros: {len(rows)}")
                        for i, row in enumerate(rows[:2]):
                            print(f"      Registro {i+1}: {row}")
                except Exception as e:
                    print(f"    Erro ao analisar tabela {table_name}: {e}")
        
        conn.close()
        
    except Exception as e:
        print(f"Erro geral ao analisar {db_file}: {e}")

# Verificar todos os bancos de dados
db_files = ['compliance.db', 'projetoaviacao.db', 'test_compliance.db', 'aviation_compliance.db']

for db_file in db_files:
    check_database(db_file)

print(f"\n=== Status da Aplicação Azure ===")
print("A aplicação atual está usando dados EM MEMÓRIA, não banco de dados persistente.")
print("Os dados são carregados a cada inicialização da aplicação.")