# Azure Secrets Verification Report
**Data:** 2025-10-15  
**Projeto:** aviation-frontend-v2

## Secrets Necessários para GitHub Actions

### 🔴 **Essenciais (Obrigatórios)**

#### 1. `AZURE_STATIC_WEB_APPS_API_TOKEN`
- **Status:** ⚠️ VERIFICAR NO GITHUB
- **Propósito:** Token de autenticação para deploy no Azure Static Web Apps
- **Usado em:**
  - `azure-static-web-apps.yml` (job: build_and_deploy_job, close_pull_request_job)
  - `frontend-ci-cd.yml` (job: build)
- **Como obter:**
  1. Acessar Azure Portal → Static Web Apps
  2. Selecionar recurso: `purple-forest-0e3ce441e`
  3. Settings → Configuration → Manage deployment token
  4. Copiar token
- **Como configurar:**
  1. GitHub → Settings → Secrets and variables → Actions
  2. New repository secret
  3. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
  4. Value: [colar token]
- **Validação:** 
  - Verificar se o workflow executa sem erro "Invalid token"
  - Token deve começar com um formato específico do Azure

---

### 🟡 **Opcionais (Recomendados)**

#### 2. `VITE_API_URL`
- **Status:** 📝 OPCIONAL
- **Propósito:** URL base para chamadas de API do frontend
- **Usado em:** Build do Vite (environment variable)
- **Valor sugerido:** 
  - Produção: `https://api.example.com`
  - Desenvolvimento: `http://localhost:3000`
- **Nota:** Se não configurado, app pode usar fallback ou URL relativa

#### 3. `VITE_AZURE_AD_CLIENT_ID`
- **Status:** 📝 OPCIONAL
- **Propósito:** Client ID para autenticação Azure AD (se implementado)
- **Usado em:** Configuração OAuth/MSAL
- **Nota:** Só necessário se houver autenticação Azure AD implementada

#### 4. `VITE_AZURE_AD_TENANT_ID`
- **Status:** 📝 OPCIONAL
- **Propósito:** Tenant ID para autenticação Azure AD (se implementado)
- **Usado em:** Configuração OAuth/MSAL
- **Nota:** Só necessário se houver autenticação Azure AD implementada

---

## Secrets Atuais no Repositório

### Como Verificar:
```bash
# No navegador:
1. Ir para https://github.com/le-97/projetoAviacao/settings/secrets/actions
2. Verificar lista de secrets configurados
3. Confirmar que AZURE_STATIC_WEB_APPS_API_TOKEN existe
```

### Checklist de Verificação:
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` existe
- [ ] Token não está expirado
- [ ] Token tem permissões corretas para o recurso Azure
- [ ] Secrets opcionais avaliados (se necessários para a aplicação)

---

## Validação de Token Azure

### Teste Manual (se necessário):
1. **Via Azure CLI:**
```bash
# Verificar se o Static Web App existe
az staticwebapp list --query "[?name=='purple-forest-0e3ce441e']"

# Verificar deployment token (precisa de permissão)
az staticwebapp secrets list --name purple-forest-0e3ce441e --resource-group <rg-name>
```

2. **Via GitHub Actions:**
- Fazer push de teste na branch main
- Verificar logs do workflow
- Procurar por erros de autenticação

### Sinais de Token Inválido:
- ❌ Erro: "Invalid deployment token"
- ❌ Erro: "Unauthorized"
- ❌ Erro: "Failed to authenticate with Azure"
- ❌ Workflow falha no step "Build And Deploy"

### Sinais de Token Válido:
- ✅ Workflow completa com sucesso
- ✅ Deploy aparece no Azure Portal
- ✅ Site atualizado em https://purple-forest-0e3ce441e.1.azurestaticapps.net

---

## Environment Variables no Código

### Verificar arquivo `.env.example` ou `.env.local`:
```bash
# Listar variáveis de ambiente usadas no código
grep -r "import.meta.env" src/ --include="*.tsx" --include="*.ts"
grep -r "process.env" src/ --include="*.tsx" --include="*.ts"
```

### Variáveis Vite Comuns:
- `VITE_API_URL` - URL da API backend
- `VITE_APP_TITLE` - Título da aplicação
- `VITE_AZURE_AD_CLIENT_ID` - Client ID OAuth
- `VITE_AZURE_AD_TENANT_ID` - Tenant ID OAuth

---

## Recomendações

### 1. **Segurança**
- ✅ Nunca commitar secrets no código
- ✅ Usar apenas GitHub Secrets para valores sensíveis
- ✅ Rotacionar tokens periodicamente (a cada 90 dias)
- ✅ Usar secrets mínimos necessários

### 2. **Documentação**
- 📝 Documentar quais secrets são obrigatórios vs opcionais
- 📝 Incluir instruções de configuração no README
- 📝 Manter lista atualizada de secrets ativos

### 3. **Testes**
- 🧪 Testar deploy após configurar/atualizar secrets
- 🧪 Validar que aplicação funciona sem secrets opcionais
- 🧪 Verificar fallbacks para variáveis não configuradas

---

## Ações Necessárias

### ✅ Concluído:
- Workflows atualizados para usar secrets corretos
- Documentação de secrets criada

### ⏳ Próximos Passos:
1. Verificar no GitHub Settings se `AZURE_STATIC_WEB_APPS_API_TOKEN` existe
2. Se não existir, obter token do Azure Portal
3. Configurar secret no GitHub
4. Testar deploy (Task #7)
5. Documentar no README (Task #8)

---

## Status: ✅ DOCUMENTADO

**Nota:** A verificação efetiva dos secrets requer acesso ao GitHub Settings do repositório. 
Esta documentação serve como guia para o processo de verificação e configuração.
