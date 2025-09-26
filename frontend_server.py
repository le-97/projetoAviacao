"""
Servidor HTTP simples para servir o frontend buildado
"""

import http.server
import socketserver
import os
import webbrowser

# Muda para o diretório dist
os.chdir('C:\\Users\\lelem\\Documents\\github\\projetoAviacao\\aviation-frontend\\dist')

PORT = 5174

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Adiciona headers CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Se o arquivo não existir, serve o index.html (para SPA routing)
        if self.path != '/' and not os.path.exists(self.path.lstrip('/')):
            self.path = '/index.html'
        return super().do_GET()

Handler = MyHTTPRequestHandler

print("🚀 Starting Frontend Server...")
print(f"📡 Frontend URL: http://localhost:{PORT}")
print("🔗 Backend URL: http://localhost:8000")
print("📊 Test Gap Analysis at: http://localhost:5174")
print("\n✨ Aviation Frontend Ready!")
print("=" * 60)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")
        httpd.shutdown()