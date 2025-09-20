#!/usr/bin/env python3
"""Simple HTTP server to mock the compliance API."""

import json
import sqlite3
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import os

class ComplianceMockHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests."""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        # Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        print(f"Request: {path}")
        
        if path == "/models":
            self.handle_models()
        elif path == "/authorities":
            self.handle_authorities()
        elif path.startswith("/compliance/check/"):
            self.handle_compliance_check(path)
        else:
            self.send_error(404, "Not Found")
            
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
    def handle_models(self):
        """Handle /models endpoint."""
        try:
            conn = sqlite3.connect('projetoaviacao.db')
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT model, variant, manufacturer, category
                FROM aircraft_models
                ORDER BY model, variant
            """)
            
            models = []
            for row in cursor.fetchall():
                model_name = f"{row[0]}"
                if row[1]:
                    model_name += f"-{row[1]}"
                    
                models.append({
                    "id": model_name,
                    "model": row[0],
                    "variant": row[1],
                    "manufacturer": row[2],
                    "description": f"{row[2]} {model_name} - {row[3] or 'Commercial Aircraft'}",
                    "supported": True
                })
            
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(models, indent=2).encode())
            
        except Exception as e:
            print(f"Error in models: {e}")
            self.send_error(500, str(e))
            
    def handle_authorities(self):
        """Handle /authorities endpoint."""
        try:
            conn = sqlite3.connect('projetoaviacao.db')
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT name, country, name
                FROM authorities
                ORDER BY country
            """)
            
            authorities = []
            for row in cursor.fetchall():
                authorities.append({
                    "name": row[0],
                    "country": row[1],
                    "description": f"{row[0]} - {row[1]} Aviation Authority"
                })
            
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(authorities, indent=2).encode())
            
        except Exception as e:
            print(f"Error in authorities: {e}")
            self.send_error(500, str(e))
            
    def handle_compliance_check(self, path):
        """Handle /compliance/check/{model}/{country} endpoint."""
        try:
            # Parse path: /compliance/check/{model}/{country}
            parts = path.split('/')
            if len(parts) < 5:
                self.send_error(400, "Invalid path format")
                return
                
            model = parts[3]
            country = parts[4]
            
            print(f"Checking compliance for {model} in {country}")
            
            # Get model and authority from database
            conn = sqlite3.connect('projetoaviacao.db')
            cursor = conn.cursor()
            
            # Find aircraft model
            cursor.execute("""
                SELECT id, model, variant, manufacturer
                FROM aircraft_models
                WHERE model || COALESCE('-' || variant, '') = ?
                   OR model = ?
                ORDER BY 
                    CASE WHEN model || COALESCE('-' || variant, '') = ? THEN 1 ELSE 2 END
                LIMIT 1
            """, (model, model, model))
            
            aircraft_row = cursor.fetchone()
            if not aircraft_row:
                self.send_error(404, f"Aircraft model {model} not found")
                return
                
            # Find authority
            cursor.execute("""
                SELECT name, country FROM authorities 
                WHERE country = ?
            """, (country,))
            
            authority_row = cursor.fetchone()
            if not authority_row:
                self.send_error(404, f"Authority for country {country} not found")
                return
                
            # Get regulations (simplified)
            cursor.execute("""
                SELECT COUNT(*) FROM regulations r
                JOIN authorities a ON r.authority_id = a.id
                WHERE a.country = ?
            """, (country,))
            
            reg_count = cursor.fetchone()[0]
            
            conn.close()
            
            # Mock compliance result
            result = {
                "aircraft_model": model,
                "country": country,
                "authority": authority_row[0],
                "compliant": True,
                "regulations_checked": reg_count,
                "violations": [],
                "summary": f"Aircraft {model} is compliant with {authority_row[0]} regulations",
                "checked_at": "2025-01-19T23:45:00Z",
                "details": {
                    "certification_status": "Valid",
                    "airworthiness": "Compliant",
                    "operational_approval": "Active"
                }
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result, indent=2).encode())
            
        except Exception as e:
            print(f"Error in compliance check: {e}")
            import traceback
            traceback.print_exc()
            self.send_error(500, str(e))

def run_server():
    """Run the mock server."""
    # Change to project directory
    os.chdir(r'c:\Users\lelem\Documents\github\projetoAviacao')
    
    server_address = ('localhost', 8000)
    httpd = HTTPServer(server_address, ComplianceMockHandler)
    
    print("🚀 Mock Compliance API Server started at http://localhost:8000")
    print("📋 Available endpoints:")
    print("  - GET /models")
    print("  - GET /authorities") 
    print("  - GET /compliance/check/{model}/{country}")
    print("")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.shutdown()

if __name__ == "__main__":
    run_server()