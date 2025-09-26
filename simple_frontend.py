import http.server
import socketserver
import os
import webbrowser
import threading
import time

PORT = 5174
DIRECTORY = r"C:\Users\lelem\Documents\github\projetoAviacao\aviation-frontend\dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def start_server():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Frontend server started at http://localhost:{PORT}")
        print(f"📁 Serving: {DIRECTORY}")
        print("=" * 50)
        httpd.serve_forever()

if __name__ == "__main__":
    start_server()