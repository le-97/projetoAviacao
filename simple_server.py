#!/usr/bin/env python3
"""
Servidor simples para testes do sistema de conformidade aeronáutica
"""

import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import time
import random

class ComplianceHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        parsed_url = urlparse(self.path)
        path_parts = parsed_url.path.strip('/').split('/')
        
        # Health check
        if self.path == '/health':
            response = {"status": "healthy", "timestamp": time.time()}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Mock AI analysis endpoint
        if len(path_parts) >= 4 and path_parts[0] == 'compliance' and path_parts[1] == 'ai-analysis':
            model = path_parts[2]
            country = path_parts[3]
            
            # Mock AI analysis response
            response = {
                "aiAnalysis": {
                    "classification": {
                        "prediction": random.choice(["compliant", "pending", "non-compliant"]),
                        "confidence": random.uniform(0.7, 0.95),
                        "method": "ai_enhanced"
                    },
                    "insights": {
                        "generated_text": f"Análise AI para {model} no {country}: Com base nos regulamentos locais, este modelo apresenta características que requerem atenção específica.",
                        "risk_factors": [
                            "Certificação de ruído específica para operações urbanas",
                            "Requisitos de manutenção diferenciados",
                            "Documentação adicional para autoridades locais"
                        ],
                        "recommendations": [
                            "Verificar certificação ICAO atualizada",
                            "Consultar autoridade de aviação local",
                            "Preparar documentação técnica completa",
                            "Considerar treinamento específico da tripulação"
                        ]
                    },
                    "similarities": [
                        {
                            "pattern": "Certificação em países com regulamentação similar",
                            "similarity": 0.87,
                            "typical_process": "Documentação + Inspeção técnica",
                            "timeline": "3-6 meses",
                            "success_rate": 0.92
                        },
                        {
                            "pattern": "Operações comerciais em mercados emergentes",
                            "similarity": 0.73,
                            "typical_process": "Certificação local + Treinamento",
                            "timeline": "4-8 meses", 
                            "success_rate": 0.85
                        }
                    ],
                    "model_info": {
                        "compliance_classifier": "bert-base-multilingual-cased",
                        "similarity_model": "all-MiniLM-L6-v2",
                        "insight_generator": "gpt-3.5-turbo"
                    },
                    "fallback_used": random.choice([True, False])
                },
                "aiEnhanced": True,
                "successProbability": random.uniform(0.6, 0.9),
                "estimatedTimeline": random.choice(["2-4 semanas", "1-2 meses", "2-3 meses"]),
                "riskLevel": random.choice(["low", "medium", "high"]),
                "error": None
            }
            
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Default response
        response = {"message": "Mock API Server Running", "endpoints": ["/health", "/compliance/ai-analysis/{model}/{country}"]}
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        """Handle POST requests"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            data = {}
        
        # Mock compliance validation
        if self.path.startswith('/compliance/validate'):
            aircraft_model = data.get('aircraftModel', 'Unknown')
            country = data.get('country', 'Unknown')
            
            response = {
                "compliant": random.choice([True, False]),
                "confidence": random.uniform(0.8, 0.95),
                "details": f"Análise de conformidade para {aircraft_model} em {country}",
                "requirements": [
                    "Certificado de aeronavegabilidade válido",
                    "Seguro de responsabilidade civil",
                    "Documentação de manutenção atualizada",
                    "Licenças da tripulação válidas"
                ],
                "recommendations": [
                    "Verificar validade dos certificados",
                    "Consultar regulamentações locais",
                    "Preparar documentação adicional se necessário"
                ]
            }
            
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Default POST response
        response = {"message": "POST request received", "data": data}
        self.wfile.write(json.dumps(response).encode())

def run_server(port=8000):
    """Start the mock server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ComplianceHandler)
    print(f"🚀 Servidor Mock iniciado na porta {port}")
    print(f"📡 Acesse: http://localhost:{port}")
    print("🔄 Frontend pode se conectar ao backend agora!")
    print("⏹️  Pressione Ctrl+C para parar o servidor")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado pelo usuário")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()