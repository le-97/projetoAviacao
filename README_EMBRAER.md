# Aviation Compliance API - Embraer E-Jets Family

## 🚁 Visão Geral

API completa para verificação de compliance da família E-Jets da Embraer, incluindo as séries E1 (original) e E2 (nova geração). Esta implementação foi desenvolvida com base em pesquisa técnica detalhada através do TaskMaster sobre as especificações e requisitos de compliance dos modelos da Embraer.

### ✈️ Modelos Suportados

#### Série E1 (Original E-Jets)
- **E170**: 78 assentos, 2.150 nm range, motores GE CF34-8E
- **E175**: 88 assentos, 2.200 nm range, motores GE CF34-8E  
- **E190**: 114 assentos, 2.400 nm range, motores GE CF34-10E
- **E195**: 124 assentos, 2.300 nm range, motores GE CF34-10E

#### Série E2 (Nova Geração)
- **E175-E2**: 90 assentos, 2.060 nm range, motores PW1700G (Geared Turbofan)
- **E190-E2**: 114 assentos, 2.850 nm range, motores PW1900G (Geared Turbofan)
- **E195-E2**: 146 assentos, 2.450 nm range, motores PW1900G (Geared Turbofan)

### 🏛️ Autoridades Regulatórias Suportadas

- **FAA** - Federal Aviation Administration (USA)
- **EASA** - European Union Aviation Safety Agency (Europe)
- **ANAC** - Agência Nacional de Aviação Civil (Brazil)
- **ICAO** - International Civil Aviation Organization (Global)

## 🚀 Como Executar

### Opção 1: Executar Diretamente com Python

```bash
# Instalar dependências
pip install -r requirements-mvp.txt

# Executar a API
python main_mvp_embraer.py
```

### Opção 2: Executar com Docker

```bash
# Build da imagem
docker build -f Dockerfile.embraer -t embraer-compliance-api .

# Executar container
docker run -p 8000:8000 embraer-compliance-api
```

### Opção 3: Testar a API

```bash
# Executar script de teste completo
python test_embraer_api.py
```

## 📊 Endpoints Disponíveis

### 📋 Informações Básicas

- `GET /` - Informações da API e status
- `GET /health` - Health check
- `GET /docs` - Documentação interativa (Swagger)

### ✈️ Modelos e Especificações

- `GET /aircraft/models` - Lista todos os modelos disponíveis
- `GET /aircraft/specifications/{model}` - Especificações técnicas de um modelo

#### Exemplo de Resposta - Especificações:
```json
{
  "model": "E190-E2",
  "series": "E2",
  "seats": 114,
  "mtow_lbs": 124341,
  "range_nm": 2850,
  "engine_type": "2 × PW1900G (Geared Turbofan)",
  "noise_compliance": "ICAO Chapter 14",
  "emissions_compliance": "Stage 5",
  "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
  "fuel_capacity_kg": 13500,
  "avionics": "Honeywell Primus Epic 2 + Fly-by-wire",
  "safety_rating": "A+"
}
```

### ✅ Verificação de Compliance

- `GET /compliance/authorities` - Lista autoridades regulatórias
- `GET /compliance/check/{model}/{authority}?check_type=full` - Verificar compliance
- `POST /compliance/check` - Verificar compliance via POST

#### Exemplo de Requisição POST:
```json
{
  "aircraft_model": "E175-E2",
  "authority": "FAA",
  "check_type": "emissions"
}
```

#### Exemplo de Resposta - Compliance:
```json
{
  "aircraft_model": "E175-E2",
  "authority": "FAA",
  "compliance_status": "COMPLIANT",
  "score": 99.0,
  "details": {
    "noise_level": "ICAO Chapter 14",
    "emissions_level": "Stage 5",
    "certifications": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
    "engine_technology": "2 × PW1700G (Geared Turbofan)",
    "avionics_suite": "Honeywell Primus Epic 2 + Fly-by-wire",
    "generation": "E2",
    "check_performed": "emissions"
  },
  "specifications": { /* objeto completo de especificações */ },
  "timestamp": "2024-10-05T17:54:57.812Z"
}
```

### 📊 Analytics e Comparações

- `GET /analytics/fleet-metrics` - Métricas da frota E-Jets
- `GET /analytics/comparison/{model1}/{model2}` - Comparar dois modelos

#### Exemplo - Fleet Metrics:
```json
{
  "total_models": 7,
  "e1_series_count": 4,
  "e2_series_count": 3,
  "average_compliance_score": 95.2,
  "compliance_by_series": {
    "E1": 93.5,
    "E2": 97.2
  },
  "latest_models": ["E175-E2", "E190-E2", "E195-E2"]
}
```

## 🔧 Tecnologias Utilizadas

- **FastAPI** - Framework web moderno e rápido
- **Pydantic** - Validação de dados e serialização
- **Uvicorn** - Servidor ASGI de alta performance
- **Docker** - Containerização para deployment
- **Python 3.11** - Linguagem base

## 📚 Dados de Pesquisa

Esta implementação foi baseada em pesquisa detalhada realizada através do TaskMaster sobre:

- Especificações técnicas completas da família E-Jets
- Requisitos de compliance das principais autoridades regulatórias
- Diferenças entre as séries E1 e E2
- Padrões de certificação ICAO, FAA, EASA e ANAC
- Tecnologias de motores (CF34 vs Geared Turbofan)
- Sistemas aviônicos (Primus Epic vs Primus Epic 2)

## 🎯 Características Principais

### ✨ Série E1 (Original)
- Motores General Electric CF34
- Aviônica Honeywell Primus Epic
- Compliance ICAO Chapter 4 / Stage 3
- 95% de commonality entre E170/E175

### 🚀 Série E2 (Nova Geração)
- Motores Pratt & Whitney Geared Turbofan (GTF)
- Aviônica Honeywell Primus Epic 2 + Fly-by-wire
- Compliance ICAO Chapter 14 / Stage 5 (mais restritivo)
- Asa de alta razão de aspecto para eficiência melhorada
- 75% de peças novas comparado ao E1

## 🧪 Validação e Testes

Execute o script de teste para validar todos os endpoints:

```bash
python test_embraer_api.py
```

O script testará:
- ✅ Endpoints básicos (root, health)
- ✅ Listagem de modelos e autoridades
- ✅ Especificações de todos os 7 modelos
- ✅ Compliance checks para diferentes combinações
- ✅ Requests POST
- ✅ Analytics e métricas da frota
- ✅ Comparação entre modelos
- ✅ Tratamento de erros (modelos inexistentes)

## 🐳 Docker

A aplicação está totalmente containerizada:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements-mvp.txt .
RUN pip install --no-cache-dir -r requirements-mvp.txt
COPY main_mvp_embraer.py main.py
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📈 Próximos Passos

- [ ] Adicionar histórico de compliance por modelo
- [ ] Implementar cache para melhorar performance  
- [ ] Adicionar métricas de emissões detalhadas
- [ ] Expandir para outros fabricantes
- [ ] Integração com base de dados real
- [ ] Sistema de notificações de mudanças regulatórias

## 🤝 Contribuições

Esta implementação serve como MVP completo e totalmente funcional para demonstração da família E-Jets da Embraer, incluindo todas as especificações técnicas e requisitos de compliance das principais autoridades regulatórias mundiais.

---

**Desenvolvido com base em pesquisa TaskMaster - Família E-Jets da Embraer** ✈️