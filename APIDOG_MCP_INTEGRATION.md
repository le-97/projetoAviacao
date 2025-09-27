# Apidog MCP Server Integration

## 📋 Overview

O **Apidog MCP Server** foi configurado para integrar nossa documentação OpenAPI com IDEs com suporte MCP (como Cursor e VS Code com Cline). Isso permite que a IA acesse diretamente nossa documentação de API para desenvolvimento assistido.

## 🚀 Configuração Atual

### MCP Server Configuration (mcp.json)
```json
{
  "mcpServers": {
    "API Documentation": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--project-id=1079901"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "APS-tLr6pAvLNkORIjKAmWlYeyT3bhS9d4Ky"
      },
      "type": "stdio"
    }
  }
}
```

### Project Details
- **Project ID:** `1079901`
- **Access Token:** Configurado via variável de ambiente
- **API Documentation Source:** Local OpenAPI files + Apidog project

## 🎯 Funcionalidades Disponíveis

Com o Apidog MCP Server, a IA pode:

### 1. **Geração de Código**
```
"Use MCP to fetch the API documentation and generate TypeScript interfaces for the ComplianceReport schema"
```

### 2. **Atualização de DTOs**
```
"Based on the API documentation, update the ComplianceReport model to include the new fields"
```

### 3. **Comentários Automáticos**
```
"Add JSDoc comments for each field in the ComplianceReport class based on the API documentation"
```

### 4. **Código MVC Completo**
```
"Generate all the Express.js controller code for the '/compliance/check' endpoint according to the API documentation"
```

### 5. **Validação de Schemas**
```
"Validate that the current API implementation matches the OpenAPI specification"
```

## 📁 Estrutura de Documentação

### Arquivos OpenAPI Locais
- `openapi.yaml` - Especificação principal
- `openapi.json` - Formato JSON para ferramentas
- `OPENAPI_README.md` - Guia de uso

### Endpoints Documentados
- **Health:** `/` e `/health`
- **Compliance:** `/compliance/check/{model}/{country}`
- **Models:** `/compliance/models`
- **Analytics:** `/analytics/fleet-metrics`
- **Monitoring:** `/metrics`

## 🔧 Comandos Úteis para IA

### Explorar Documentação
```
"List all available API endpoints from the MCP documentation"
"Show me the schema for ComplianceReport from the API docs"
"What are the supported aircraft models according to the API documentation?"
```

### Geração de Código
```
"Generate Python client code for the compliance check endpoint using MCP docs"
"Create React components that consume the /analytics/fleet-metrics endpoint"
"Generate OpenAPI client for JavaScript/TypeScript"
```

### Validação e Teste
```
"Compare the current FastAPI implementation with the OpenAPI spec from MCP"
"Generate Postman collection from the MCP API documentation"
"Create test cases based on the API documentation examples"
```

## 🌐 Integração com OpenAPI Local

O Apidog MCP Server está configurado para trabalhar tanto com:

1. **Projeto Apidog (ID: 1079901)** - Documentação centralizada
2. **Arquivos OpenAPI locais** - `openapi.yaml` e `openapi.json`

### Para usar arquivos OpenAPI locais:
```json
{
  "mcpServers": {
    "Local API Documentation": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--oas=./openapi.yaml"
      ],
      "type": "stdio"
    }
  }
}
```

## 🔒 Segurança

### Token de Acesso
- Token configurado como variável de ambiente
- **Não commitar** tokens diretamente no código
- Para equipes: configurar `APIDOG_ACCESS_TOKEN` localmente

### Alternativa Segura para Equipes
```json
{
  "mcpServers": {
    "API Documentation": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--project-id=1079901"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "${APIDOG_ACCESS_TOKEN}"
      }
    }
  }
}
```

## 🛠️ Troubleshooting

### Problema: Comando não encontrado
```bash
# Instalar globalmente
npm install -g apidog-mcp-server@latest

# Ou usar npx diretamente (recomendado)
npx apidog-mcp-server@latest --help
```

### Problema: Windows - Configuração não funciona
Use a configuração alternativa para Windows:
```json
{
  "mcpServers": {
    "API Documentation": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "apidog-mcp-server@latest",
        "--project-id=1079901"
      ],
      "env": {
        "APIDOG_ACCESS_TOKEN": "APS-tLr6pAvLNkORIjKAmWlYeyT3bhS9d4Ky"
      }
    }
  }
}
```

### Problema: Token inválido
1. Verificar token no Apidog: Avatar > Account Settings > API Access Token
2. Gerar novo token se necessário
3. Atualizar variável de ambiente

## 📚 Recursos Adicionais

- **Documentação oficial:** [npmjs.com/package/apidog-mcp-server](https://www.npmjs.com/package/apidog-mcp-server)
- **Suporte:** [Discord da Apidog](https://discord.com/invite/ZBxrzyXfbJ)
- **OpenAPI Spec:** `./openapi.yaml`
- **API Docs local:** http://localhost:8000/docs

## 🎯 Próximos Passos

1. **Testar a integração** com comandos de IA
2. **Gerar código cliente** em diferentes linguagens
3. **Automatizar validação** entre spec e implementação
4. **Criar testes automatizados** baseados na documentação

---

**💡 Dica:** Use nomes descritivos ao interagir com a IA, como "Use the API Documentation MCP to..." para que ela saiba usar a fonte correta de informações.