# Local OpenAPI MCP Configuration

Para usar o arquivo OpenAPI local em vez do projeto Apidog, você pode usar esta configuração alternativa:

```json
{
  "mcpServers": {
    "Local API Documentation": {
      "command": "npx",
      "args": [
        "-y",
        "apidog-mcp-server@latest",
        "--oas=./openapi.yaml"
      ]
    }
  }
}
```

## Testado e Funcionando ✅

Ambas as configurações foram testadas com sucesso:

1. **Configuração Principal (Projeto Apidog):**
   - Project ID: 1079901
   - Status: ✅ Running
   
2. **Configuração Local (OpenAPI file):**
   - File: ./openapi.yaml
   - Status: ✅ Running

## Comandos de Teste

```bash
# Testar com projeto Apidog
APIDOG_ACCESS_TOKEN="APS-tLr6pAvLNkORIjKAmWlYeyT3bhS9d4Ky" npx apidog-mcp-server@latest --project-id=1079901

# Testar com arquivo local
npx apidog-mcp-server@latest --oas=./openapi.yaml
```

Ambos retornam:
```
Apidog MCP Server is running, communicating via stdio
ⓘ Please read the help docs to learn how to use it: https://docs.apidog.com/apidog-mcp-server
```