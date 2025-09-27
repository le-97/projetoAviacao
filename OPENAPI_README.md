# OpenAPI/Swagger Specification

## 📋 Especificação da API do Sistema de Compliance Aeronáutico

Este diretório contém a especificação OpenAPI 3.0.3 completa para o **Aviation Compliance Microservice**.

### 📁 Arquivos Disponíveis

- **`openapi.yaml`** - Especificação principal em formato YAML
- **`openapi.json`** - Especificação em formato JSON para integração com ferramentas
- **`README.md`** - Este documento explicativo

### 🚀 Como Usar

#### 1. **Visualizar a Documentação**

**Swagger UI (Recomendado):**
```bash
# Localmente com o servidor rodando
http://localhost:8000/docs

# Ou use o Swagger Editor online
https://editor.swagger.io/
# Cole o conteúdo do openapi.yaml
```

**ReDoc (Alternativa):**
```bash
# Localmente
http://localhost:8000/redoc

# Ou online
https://redocly.github.io/redoc/
# Cole a URL do arquivo JSON
```

#### 2. **Integração com Ferramentas**

**Postman:**
1. Importe o arquivo `openapi.json`
2. Collection será criada automaticamente com todos os endpoints

**Insomnia:**
1. Importe o arquivo `openapi.yaml`
2. Workspace será configurado com requests pré-definidos

**VS Code:**
- Use a extensão "OpenAPI (Swagger) Editor"
- Abra o arquivo `openapi.yaml` para edição com autocomplete

#### 3. **Geração de Código Cliente**

**OpenAPI Generator:**
```bash
# Python
openapi-generator generate -i openapi.yaml -g python -o ./clients/python

# JavaScript/TypeScript
openapi-generator generate -i openapi.yaml -g typescript-axios -o ./clients/typescript

# Java
openapi-generator generate -i openapi.yaml -g java -o ./clients/java
```

**Swagger Codegen:**
```bash
swagger-codegen generate -i openapi.yaml -l python -o ./clients/python
```

### 🛠️ Estrutura da API

#### **Endpoints Principais:**

1. **Health & Status**
   - `GET /` - Health check básico
   - `GET /health` - Status detalhado do sistema

2. **Compliance Checking**
   - `GET /compliance/check/{model}/{country}` - Verificação de compliance
   - `GET /compliance/check-compliance` - Endpoint legacy
   - `GET /compliance/models` - Modelos suportados
   - `GET /compliance/authorities` - Autoridades regulatórias

3. **Analytics & Monitoring**
   - `GET /analytics/fleet-metrics` - Métricas da frota
   - `GET /analytics/compliance-trends` - Tendências de compliance
   - `GET /metrics` - Métricas do sistema

#### **Modelos Suportados:**
- E175, E175-E1, E175-E2
- E190, E190-E1, E190-E2  
- E195, E195-E1, E195-E2
- Boeing 737 variants
- Airbus A320 variants

#### **Países/Regiões:**
- **USA** - FAA regulations
- **BRAZIL** - ANAC regulations  
- **EUROPE** - EASA regulations

### 🔒 Autenticação

A API suporta múltiplos métodos de autenticação:

1. **JWT Bearer Token:**
   ```http
   Authorization: Bearer <jwt_token>
   ```

2. **API Key:**
   ```http
   X-API-Key: <api_key>
   ```

3. **Acesso Público** (alguns endpoints)

### 📊 Rate Limiting

- **Compliance Endpoint:** 30 requests/minute
- **Metrics Endpoint:** 120 requests/minute
- **Health Endpoint:** 300 requests/minute
- **Default:** 60 requests/minute

### 🌐 Servidores Disponíveis

1. **Desenvolvimento:** `http://localhost:8000`
2. **Produção:** `https://aviation-compliance-api.onrender.com`
3. **Frontend:** `https://salmon-desert-0b07e100f-preview.eastus2.2.azurestaticapps.net`

### 📝 Exemplos de Uso

#### Verificar Compliance de E175-E2 nos EUA:
```bash
curl -X GET "http://localhost:8000/compliance/check/E175-E2/USA" \
  -H "accept: application/json"
```

#### Obter Lista de Modelos Suportados:
```bash
curl -X GET "http://localhost:8000/compliance/models" \
  -H "accept: application/json"
```

#### Health Check Detalhado:
```bash
curl -X GET "http://localhost:8000/health" \
  -H "accept: application/json"
```

### 🔄 Atualizações da Especificação

Para manter a especificação atualizada:

1. **Edite o arquivo `openapi.yaml`**
2. **Valide a especificação:**
   ```bash
   swagger-codegen validate -i openapi.yaml
   ```
3. **Regenere o JSON:**
   ```bash
   # Use uma ferramenta como yq ou online converter
   yq eval -o=json openapi.yaml > openapi.json
   ```

### 📚 Recursos Adicionais

- **OpenAPI Specification:** https://swagger.io/specification/
- **Swagger Tools:** https://swagger.io/tools/
- **ReDoc Documentation:** https://redocly.com/redoc/
- **OpenAPI Generator:** https://openapi-generator.tech/

### 🐛 Relatório de Problemas

Se encontrar inconsistências na especificação:

1. Verifique a implementação atual da API
2. Compare com a especificação OpenAPI
3. Crie um issue no repositório do projeto
4. Inclua exemplos de request/response esperados vs atuais

---

**📌 Esta especificação OpenAPI garante que a documentação da API esteja sempre sincronizada com a implementação real, facilitando a integração e o desenvolvimento de clientes.**