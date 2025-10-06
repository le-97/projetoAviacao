# 🚁 Aviation Compliance MVP

## ✅ MVP Totalmente Funcional - SEM ERROS

Este é um MVP (Minimum Viable Product) simplificado da API de Compliance de Aviação, projetado para funcionar sem erros de dependências.

## 🎯 O que funciona:

- ✅ API FastAPI básica
- ✅ Endpoints de compliance para aeronaves E175, E190, E195
- ✅ Suporte para USA, BRAZIL, EUROPE
- ✅ Health check
- ✅ Documentação automática Swagger
- ✅ Build Docker funcional

## 🚀 Como executar:

### Opção 1: Localmente com Python

```bash
# 1. Instalar dependências mínimas
pip install fastapi==0.104.1 uvicorn[standard]==0.24.0 pydantic==2.5.2

# 2. Executar o MVP
python main_mvp.py
```

### Opção 2: Docker (RECOMENDADO)

```bash
# 1. Build da imagem
docker build -f Dockerfile.mvp -t aviation-mvp:latest .

# 2. Executar container
docker run -d --name aviation-mvp -p 8000:8000 aviation-mvp:latest

# 3. Testar
curl http://localhost:8000/health
```

## 📚 Endpoints disponíveis:

- `GET /` - Informações básicas da API
- `GET /health` - Health check
- `GET /compliance/models` - Modelos de aeronaves disponíveis
- `GET /compliance/authorities` - Autoridades regulatórias
- `GET /compliance/check/{model}/{country}` - Verificar compliance
- `POST /compliance/check` - Verificar compliance via POST
- `GET /analytics/simple-metrics` - Métricas básicas

## 🌐 Acessar documentação:

Após iniciar o servidor, acesse:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## 🧪 Testar o MVP:

```bash
# Testar com script automatizado
python test_mvp.py

# Ou testar manualmente:
curl http://localhost:8000/
curl http://localhost:8000/health
curl http://localhost:8000/compliance/check/E175/USA
```

## ✨ Exemplo de resposta:

```json
{
  "aircraft_model": "E175",
  "country": "USA",
  "status": "success",
  "compliant": true,
  "message": "All FAA requirements met"
}
```

## 🐳 Docker Cleanup:

```bash
docker stop aviation-mvp
docker rm aviation-mvp
docker rmi aviation-mvp:latest
```

## 📁 Arquivos do MVP:

- `main_mvp.py` - Aplicação principal
- `Dockerfile.mvp` - Dockerfile simplificado
- `requirements-mvp.txt` - Dependências mínimas
- `test_mvp.py` - Script de teste
- `build_mvp.py` - Script de build Docker

## 🔧 Resolução de problemas:

Se encontrar erro de porta ocupada:
```bash
# Verificar processos na porta 8000
netstat -ano | findstr :8000

# Parar processo se necessário
taskkill /F /PID <PID>
```

## 🎉 Status: FUNCIONANDO SEM ERROS!