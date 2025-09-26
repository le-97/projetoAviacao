"""
Servidor de demonstração para Gap Analysis
Simula o endpoint implementado no backend
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime

class GapAnalysisHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse URL
        parsed_url = urllib.parse.urlparse(self.path)
        path_parts = parsed_url.path.strip('/').split('/')
        
        # Enable CORS
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Check if it's gap analysis endpoint
        if len(path_parts) >= 5 and path_parts[0] == 'compliance' and path_parts[1] == 'gap-analysis':
            model = path_parts[2]
            origin = path_parts[3]
            target = path_parts[4]
            
            # Generate mock gap analysis response
            response = self.generate_gap_analysis(model, origin, target)
            self.wfile.write(json.dumps(response, indent=2).encode())
        else:
            # Default response
            response = {
                "message": "Gap Analysis Demo Server",
                "endpoints": [
                    "/compliance/gap-analysis/{model}/{origin_country}/{target_country}"
                ],
                "example": "/compliance/gap-analysis/e190/BR/US"
            }
            self.wfile.write(json.dumps(response, indent=2).encode())
    
    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def generate_gap_analysis(self, model, origin, target):
        """Generate realistic gap analysis response"""
        
        # Country mapping
        countries = {
            'BR': {'name': 'Brasil', 'authority': 'ANAC'},
            'US': {'name': 'Estados Unidos', 'authority': 'FAA'},
            'EU': {'name': 'União Europeia', 'authority': 'EASA'},
            'UK': {'name': 'Reino Unido', 'authority': 'UK CAA'},
            'CA': {'name': 'Canadá', 'authority': 'Transport Canada'}
        }
        
        origin_info = countries.get(origin.upper(), {'name': origin, 'authority': 'Unknown'})
        target_info = countries.get(target.upper(), {'name': target, 'authority': 'Unknown'})
        
        # Generate gaps based on target country
        gaps = []
        
        if target.upper() == 'US':
            gaps = [
                {
                    "category": "Type Certification",
                    "requirement": "FAA Type Certificate or Validation",
                    "current_status": "Missing" if origin.upper() != "US" else "Available",
                    "gap_description": "Requires FAA type certificate validation or acceptance of foreign type certificate",
                    "impact": "high",
                    "estimated_effort": "6-12 months",
                    "cost_estimate": "$250,000 - $1,000,000"
                },
                {
                    "category": "Noise Certification",
                    "requirement": "FAR Part 36 Noise Certificate",
                    "current_status": "Verification Required",
                    "gap_description": "Must demonstrate compliance with FAR Part 36 noise standards",
                    "impact": "medium",
                    "estimated_effort": "3-6 months",
                    "cost_estimate": "$50,000 - $150,000"
                }
            ]
            
            if model.lower() in ['kc390', 'kc-390']:
                gaps.append({
                    "category": "Military/Export Control",
                    "requirement": "ITAR Compliance",
                    "current_status": "Required",
                    "gap_description": "International Traffic in Arms Regulations compliance for military aircraft",
                    "impact": "critical",
                    "estimated_effort": "12-24 months",
                    "cost_estimate": "$500,000 - $2,000,000"
                })
        
        elif target.upper() == 'EU':
            gaps = [
                {
                    "category": "Type Certification",
                    "requirement": "EASA Type Certificate",
                    "current_status": "Missing" if origin.upper() not in ["EU", "UK"] else "Available",
                    "gap_description": "EASA type certificate required for EU operations",
                    "impact": "high",
                    "estimated_effort": "8-14 months",
                    "cost_estimate": "$300,000 - $1,200,000"
                },
                {
                    "category": "Environmental",
                    "requirement": "ICAO Annex 16 Compliance",
                    "current_status": "Verification Required",
                    "gap_description": "Strict noise and emission limits per ICAO Annex 16",
                    "impact": "high",
                    "estimated_effort": "4-8 months",
                    "cost_estimate": "$100,000 - $300,000"
                }
            ]
        
        # Calculate summary
        critical_gaps = len([g for g in gaps if g.get("impact") == "critical"])
        high_gaps = len([g for g in gaps if g.get("impact") == "high"])
        
        overall_risk = "critical" if critical_gaps > 0 else "high" if high_gaps > 1 else "medium"
        timeline = "12-24 months" if critical_gaps > 0 else "6-12 months" if high_gaps > 1 else "3-6 months"
        
        # Check for bilateral agreements
        has_basa = (origin.upper() == 'BR' and target.upper() in ['US', 'CA']) or \
                   (origin.upper() in ['US', 'CA'] and target.upper() == 'BR')
        
        return {
            "analysis": {
                "model": model.upper(),
                "originCountry": f"{origin_info['name']} ({origin_info['authority']})",
                "targetCountry": f"{target_info['name']} ({target_info['authority']})",
                "analysisDate": datetime.now().isoformat()
            },
            "summary": {
                "totalGaps": len(gaps),
                "criticalGaps": critical_gaps,
                "highImpactGaps": high_gaps,
                "overallRisk": overall_risk,
                "estimatedTimeline": timeline,
                "estimatedCostRange": "$325,000 - $1,675,000" if gaps else "$0 - $0"
            },
            "gaps": gaps,
            "recommendations": [
                "Engage regulatory consultants early in the process",
                "Prepare comprehensive documentation package",
                "Allow additional time for regulatory review",
                "Consider bilateral agreement benefits" if has_basa else "No bilateral agreements available"
            ],
            "actionPlan": [
                {
                    "phase": 1,
                    "title": "Initial Assessment and Planning",
                    "duration": "1-2 months",
                    "items": [
                        "Review regulatory requirements",
                        "Engage regulatory consultants",
                        "Prepare documentation strategy"
                    ]
                },
                {
                    "phase": 2,
                    "title": "Certification Process",
                    "duration": "6-12 months",
                    "items": [f"Complete {gap['requirement']}" for gap in gaps[:3]]
                },
                {
                    "phase": 3,
                    "title": "Final Validation",
                    "duration": "2-4 months",
                    "items": [
                        "Submit final certification package",
                        "Coordinate with regulatory authority",
                        "Obtain operational approval"
                    ]
                }
            ],
            "regulatoryContext": {
                "originFramework": {
                    "authority": origin_info['authority'],
                    "framework": "Country-specific aviation regulations",
                    "standards": "ICAO compliant",
                    "strengths": ["Established certification process"]
                },
                "targetFramework": {
                    "authority": target_info['authority'],
                    "framework": "Country-specific aviation regulations", 
                    "standards": "ICAO compliant with local requirements",
                    "strengths": ["Comprehensive safety oversight"]
                },
                "bilateralAgreements": {
                    "hasBilateralAgreement": has_basa,
                    "agreementType": "BASA (Bilateral Aviation Safety Agreement)" if has_basa else "None",
                    "benefits": ["Expedited certification", "Reduced costs"] if has_basa else [],
                    "limitations": [] if has_basa else ["Full certification required", "Extended timeline"]
                }
            }
        }

def run_server():
    print("🚀 Starting Gap Analysis Demo Server...")
    print("📡 Server URL: http://localhost:8000")
    print("🔗 Frontend URL: http://localhost:5174")
    print("📊 Test endpoint: http://localhost:8000/compliance/gap-analysis/e190/BR/US")
    print("\n✨ Gap Analysis Implementation Demo Ready!")
    print("=" * 60)
    
    server = HTTPServer(('localhost', 8000), GapAnalysisHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        server.shutdown()

if __name__ == "__main__":
    run_server()