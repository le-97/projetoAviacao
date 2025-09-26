"""
Servidor HTTP robusto para o frontend buildado
"""

import http.server
import socketserver
import os
import json
from urllib.parse import urlparse

# Configurações
PORT = 5174
FRONTEND_DIR = r'C:\Users\lelem\Documents\github\projetoAviacao\aviation-frontend\dist'

class ReactHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)
    
    def end_headers(self):
        # Headers CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Parse da URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Se é uma rota da SPA (não é um arquivo), serve o index.html
        if not path.startswith('/assets/') and not path.endswith('.ico') and path != '/':
            # Para rotas da SPA, sempre serve o index.html
            self.path = '/index.html'
        
        return super().do_GET()
    
    def do_OPTIONS(self):
        # Resposta para preflight CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def start_server():
    print("🚀 Starting React Frontend Server...")
    print(f"📁 Serving from: {FRONTEND_DIR}")
    print(f"🌐 Frontend URL: http://localhost:{PORT}")
    print("🔗 Backend URL: http://localhost:8000")
    print("\n📋 Como Testar:")
    print("1. Acesse: http://localhost:5174")
    print("2. Clique na aba 'Análise de Lacunas'")
    print("3. Configure: KC-390, BR → US")
    print("4. Execute a análise")
    print("\n✨ Frontend Ready!")
    print("=" * 60)
    
    # Verifica se o diretório existe
    if not os.path.exists(FRONTEND_DIR):
        print(f"❌ ERRO: Diretório não encontrado: {FRONTEND_DIR}")
        return
    
    # Verifica se index.html existe
    index_path = os.path.join(FRONTEND_DIR, 'index.html')
    if not os.path.exists(index_path):
        print(f"❌ ERRO: index.html não encontrado em: {index_path}")
        return
    
    with socketserver.TCPServer(("", PORT), ReactHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Frontend server stopped")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()