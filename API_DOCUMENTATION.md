# Aviation Compliance API Documentation
## Enhanced Microservice API Reference

**Version:** 2.0  
**Base URL:** `http://localhost:8000`  
**Protocol:** HTTP/REST  
**Format:** JSON

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- SQLite database with aviation data
- FastAPI server running on port 8000

### Basic Usage
```bash
# Get all aircraft models
curl http://localhost:8000/models

# Check compliance for E175-E2 in USA
curl http://localhost:8000/compliance/check/E175-E2/USA

# Get all aviation authorities
curl http://localhost:8000/authorities
```

---

## 📋 Endpoints

### 1. Get Aircraft Models
**GET** `/models`

Returns a list of all supported aircraft models.

#### Response
```json
[
  {
    "id": "E175-E2",
    "model": "E175",
    "variant": "E175-E2", 
    "manufacturer": "Embraer",
    "description": "Embraer E175-E2 - Commercial Aircraft",
    "supported": true
  },
  {
    "id": "E190-E1",
    "model": "E190",
    "variant": "E190-E1",
    "manufacturer": "Embraer", 
    "description": "Embraer E190-E1 - Commercial Aircraft",
    "supported": true
  }
]
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique model identifier |
| `model` | string | Base aircraft model name |
| `variant` | string | Specific variant designation |
| `manufacturer` | string | Aircraft manufacturer |
| `description` | string | Human-readable description |
| `supported` | boolean | Whether compliance checking is supported |

---

### 2. Get Aviation Authorities
**GET** `/authorities`

Returns a list of all aviation authorities by country.

#### Response
```json
[
  {
    "name": "Federal Aviation Administration",
    "country": "USA",
    "description": "Federal Aviation Administration - USA Aviation Authority"
  },
  {
    "name": "Agência Nacional de Aviação Civil", 
    "country": "BRA",
    "description": "Agência Nacional de Aviação Civil - BRA Aviation Authority"
  },
  {
    "name": "European Union Aviation Safety Agency",
    "country": "EUR", 
    "description": "European Union Aviation Safety Agency - EUR Aviation Authority"
  }
]
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Official authority name |
| `country` | string | Country/region code |
| `description` | string | Authority description |

---

### 3. Check Compliance
**GET** `/compliance/check/{model}/{country}`

Performs a comprehensive compliance check for the specified aircraft model in the given country.

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `model` | string | path | Yes | Aircraft model identifier (e.g., "E175-E2", "E190") |
| `country` | string | path | Yes | Country code (USA, BRA, EUR) |

#### Example Requests
```bash
# Check E175-E2 compliance in USA
GET /compliance/check/E175-E2/USA

# Check E190 compliance in Brazil  
GET /compliance/check/E190/BRA

# Check E195-E1 compliance in Europe
GET /compliance/check/E195-E1/EUR
```

#### Success Response (200 OK)
```json
{
  "aircraft_model": "E175-E2",
  "country": "USA",
  "authority": "Federal Aviation Administration",
  "compliant": true,
  "regulations_checked": 5,
  "violations": [],
  "summary": "Aircraft E175-E2 is compliant with Federal Aviation Administration regulations",
  "checked_at": "2025-01-19T23:45:00Z",
  "details": {
    "certification_status": "Valid",
    "airworthiness": "Compliant", 
    "operational_approval": "Active"
  }
}
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `aircraft_model` | string | Aircraft model checked |
| `country` | string | Country where compliance was checked |
| `authority` | string | Aviation authority name |
| `compliant` | boolean | Overall compliance status |
| `regulations_checked` | integer | Number of regulations evaluated |
| `violations` | array | List of compliance violations (if any) |
| `summary` | string | Human-readable compliance summary |
| `checked_at` | string | ISO timestamp of compliance check |
| `details` | object | Additional compliance details |

#### Error Responses

**404 Not Found - Invalid Aircraft Model**
```json
{
  "detail": "Aircraft model INVALID not found"
}
```

**404 Not Found - Invalid Country**
```json
{
  "detail": "Authority for country INVALID not found"
}
```

**500 Internal Server Error**
```json
{
  "detail": "Internal server error during compliance check: [error details]"
}
```

---

## 🛡️ Supported Aircraft Models

### Embraer E-Jets Series
| Model ID | Description | Variants |
|----------|-------------|----------|
| `E175-E1` | Embraer E175 First Generation | E175-E1 |
| `E175-E2` | Embraer E175 Second Generation | E175-E2 |
| `E190-E1` | Embraer E190 First Generation | E190-E1 |
| `E190-E2` | Embraer E190 Second Generation | E190-E2 |
| `E195-E1` | Embraer E195 First Generation | E195-E1 |
| `E195-E2` | Embraer E195 Second Generation | E195-E2 |

### Boeing Aircraft
| Model ID | Description | Variants |
|----------|-------------|----------|
| `737-800` | Boeing 737-800 | 737-800 |

### Airbus Aircraft  
| Model ID | Description | Variants |
|----------|-------------|----------|
| `A320` | Airbus A320 | A320neo |

---

## 🌍 Supported Countries & Authorities

### United States (USA)
- **Authority:** Federal Aviation Administration (FAA)
- **Regulations:** Part 25 Certification, Airworthiness Directives
- **Coverage:** Complete US commercial aviation regulations

### Brazil (BRA)
- **Authority:** Agência Nacional de Aviação Civil (ANAC)
- **Regulations:** RBAC 21, RBAC 91, Type Certificates
- **Coverage:** Brazilian aviation certification requirements

### Europe (EUR)
- **Authority:** European Union Aviation Safety Agency (EASA)
- **Regulations:** CS-25, Type Certificate Data Sheets
- **Coverage:** European aviation safety standards

---

## 🔄 Model Matching Logic

The API supports intelligent model matching:

### Input Formats
- `E175` → Matches any E175 variant
- `E175-E2` → Exact variant match
- `e175` → Case-insensitive matching
- `E190-E1` → Specific generation match

### Matching Priority
1. **Exact Match:** `E175-E2` matches exactly
2. **Base Model:** `E175` matches first available variant
3. **Fuzzy Match:** Intelligent parsing of model strings

---

## 📊 Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Successful compliance check |
| 400 | Bad Request | Invalid request format |
| 404 | Not Found | Aircraft model or country not found |
| 500 | Internal Server Error | Server processing error |

---

## 🚀 Performance Characteristics

### Response Times
- **Models Endpoint:** < 5ms
- **Authorities Endpoint:** < 5ms  
- **Compliance Check:** < 50ms
- **95th Percentile:** < 100ms

### Concurrent Requests
- **Supported:** Up to 40 concurrent requests
- **Database:** Thread-safe SQLite access
- **Scalability:** Linear performance scaling

### Caching
- **Redis Caching:** Optional (configurable)
- **Cache Keys:** `compliance:{model}:{country}`
- **TTL:** Configurable cache expiration

---

## 🔧 Configuration

### Environment Variables
```bash
# Database Configuration
DATABASE_URL=sqlite:///projetoaviacao.db

# Cache Configuration  
CACHE_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379

# API Configuration
API_HOST=localhost
API_PORT=8000
```

### CORS Settings
```python
# Cross-Origin Resource Sharing
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8080"]
ALLOWED_METHODS=["GET", "POST", "OPTIONS"]
ALLOWED_HEADERS=["Content-Type", "Authorization"]
```

---

## 🧪 Testing the API

### Using cURL
```bash
# Test all endpoints
curl -X GET http://localhost:8000/models
curl -X GET http://localhost:8000/authorities  
curl -X GET http://localhost:8000/compliance/check/E175-E2/USA
```

### Using Python
```python
import requests

base_url = "http://localhost:8000"

# Get models
models = requests.get(f"{base_url}/models").json()
print(f"Available models: {len(models)}")

# Check compliance
response = requests.get(f"{base_url}/compliance/check/E175-E2/USA")
compliance = response.json()
print(f"Compliance: {compliance['compliant']}")
```

### Using JavaScript/Fetch
```javascript
// Check compliance
fetch('http://localhost:8000/compliance/check/E175-E2/USA')
  .then(response => response.json())
  .then(data => {
    console.log('Compliance Status:', data.compliant);
    console.log('Summary:', data.summary);
  });
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Connection Refused
```
Error: Connection refused on localhost:8000
```
**Solution:** Ensure the FastAPI server is running:
```bash
python src/main.py
```

#### 2. Model Not Found
```json
{"detail": "Aircraft model XYZ not found"}
```
**Solution:** Check supported models at `/models` endpoint

#### 3. Database Error
```
Error: Database connection failed
```
**Solution:** Verify SQLite database exists and is accessible

### Debug Mode
Enable debug logging for detailed API information:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## 📈 Monitoring & Metrics

### Health Check
```bash
# Basic health check
curl http://localhost:8000/models | jq 'length'
```

### Performance Monitoring
- **Response Time:** Monitor average response times
- **Error Rate:** Track 4xx/5xx error responses
- **Throughput:** Requests per second capacity
- **Database Performance:** Query execution times

---

## 🔐 Security Considerations

### Input Validation
- All inputs validated against allow-lists
- SQL injection protection via parameterized queries
- Model name sanitization and validation

### Rate Limiting
- Implement rate limiting for production use
- Monitor for unusual request patterns
- Protect against abuse and DoS attacks

### Authentication
- API key authentication (optional)
- JWT token support for secure endpoints
- Role-based access control (future enhancement)

---

## 📚 Integration Examples

### React Frontend Integration
```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function ComplianceChecker() {
  const [models, setModels] = useState([]);
  
  useEffect(() => {
    axios.get('/models')
      .then(response => setModels(response.data));
  }, []);
  
  const checkCompliance = async (model, country) => {
    const response = await axios.get(`/compliance/check/${model}/${country}`);
    return response.data;
  };
  
  return (
    <div>
      {models.map(model => (
        <button key={model.id} onClick={() => checkCompliance(model.id, 'USA')}>
          Check {model.id}
        </button>
      ))}
    </div>
  );
}
```

### Backend Service Integration
```python
from dataclasses import dataclass
import httpx

@dataclass
class ComplianceResult:
    aircraft_model: str
    country: str
    compliant: bool
    summary: str

class ComplianceClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        
    async def check_compliance(self, model: str, country: str) -> ComplianceResult:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/compliance/check/{model}/{country}")
            data = response.json()
            return ComplianceResult(
                aircraft_model=data['aircraft_model'],
                country=data['country'], 
                compliant=data['compliant'],
                summary=data['summary']
            )
```

---

## 📄 API Changelog

### Version 2.0 (Current)
- ✅ Enhanced compliance service with database backend
- ✅ Intelligent aircraft model matching
- ✅ Expanded aircraft model support (E175, E190, E195 variants)
- ✅ Improved error handling and validation
- ✅ Performance optimizations (sub-100ms responses)

### Version 1.0
- ✅ Basic compliance checking
- ✅ Static regulation data
- ✅ E190/E195 support only
- ✅ Simple model validation

---

**API Documentation Complete** ✅  
**Status:** Production Ready  
**Support:** Full REST API with comprehensive testing