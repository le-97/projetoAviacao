# ⚠️ AÇÃO URGENTE: Mudar Branch Padrão no GitHub

## 🔴 **PROBLEMA CRÍTICO IDENTIFICADO**

**Status Atual:**
```
Branch padrão no GitHub: 003-projeto-de-microservi
Branch dos workflows:    main
Resultado:              ❌ Workflows NÃO executam automaticamente
```

**Impacto:**
- GitHub Actions workflows não executam em pull requests
- CI/CD não roda automaticamente
- Deploy não acontece em pushs para a branch principal

---

## ✅ **SOLUÇÃO: Mudar Branch Padrão para "main"**

### **Passo a Passo:**

#### 1. Acessar Settings do Repositório
```
URL: https://github.com/le-97/projetoAviacao/settings
```

**Caminho no GitHub:**
```
1. Ir em: https://github.com/le-97/projetoAviacao
2. Clicar na aba "Settings" (⚙️ no topo)
3. No menu lateral esquerdo, clicar em "Branches"
```

#### 2. Localizar a Seção "Default Branch"
```
Você verá:
┌─────────────────────────────────────────────┐
│ Default branch                               │
├─────────────────────────────────────────────┤
│ The default branch is considered the "base" │
│ branch in your repository.                   │
│                                              │
│ 003-projeto-de-microservi        🔄 Switch   │
└─────────────────────────────────────────────┘
```

#### 3. Clicar no Botão "🔄 Switch"
```
Um modal vai abrir perguntando qual branch você quer definir como padrão
```

#### 4. Selecionar "main"
```
┌────────────────────────────────────────┐
│ Switch default branch to main          │
├────────────────────────────────────────┤
│ Branch: [dropdown]                     │
│         ▼ main                         │
│                                        │
│ [Update]  [Cancel]                    │
└────────────────────────────────────────┘
```

#### 5. Confirmar a Mudança
```
GitHub vai avisar:
"Changing your default branch can have unintended consequences..."

✅ Clicar em "I understand, update the default branch"
```

#### 6. Verificar a Mudança
```
Voltar em: https://github.com/le-97/projetoAviacao

Você deve ver:
┌────────────────────────────────────┐
│ le-97 / projetoAviacao             │
│                                    │
│ [main ▼] 📝 Code  📊 Issues  etc. │
└────────────────────────────────────┘
```

---

## 🧪 **Testar se Funcionou**

### Opção 1: Criar um Commit de Teste
```bash
cd c:\Users\lelem\Documents\github\projetoAviacao

# Criar arquivo de teste
echo "# Test commit" > test_branch_change.txt

# Commit e push
git add test_branch_change.txt
git commit -m "test: verify default branch change"
git push origin main
```

### Opção 2: Verificar na Interface
```
1. Ir em: https://github.com/le-97/projetoAviacao/actions
2. Verificar se novos workflows aparecem automaticamente
3. Status esperado: ✅ Workflows executando
```

---

## 📊 **Antes vs Depois**

### Antes (Estado Atual - ❌)
```yaml
# GitHub Settings
Default branch: 003-projeto-de-microservi

# Workflows (.github/workflows/*.yml)
on:
  push:
    branches: [ main ]

Resultado: ❌ Workflows NÃO executam
           (branch padrão diferente da configuração)
```

### Depois (Estado Desejado - ✅)
```yaml
# GitHub Settings
Default branch: main

# Workflows (.github/workflows/*.yml)
on:
  push:
    branches: [ main ]

Resultado: ✅ Workflows executam automaticamente
           (branch padrão igual à configuração)
```

---

## 🔍 **O que Acontece Depois da Mudança**

### Imediatamente:
- ✅ Novos PRs serão criados contra `main` por padrão
- ✅ Clone do repositório baixa `main` por padrão
- ✅ Interface do GitHub mostra `main` como principal

### No Próximo Push:
- ✅ Workflows executam automaticamente em `main`
- ✅ CI/CD roda: testes, build, deploy
- ✅ Azure Static Web Apps atualiza automaticamente

### Workflows que Serão Ativados:
```
1. azure-static-web-apps.yml
   - Build do frontend
   - Deploy para Azure
   
2. frontend-ci-cd.yml
   - Lint & Type Check
   - Build validation
   - Deploy para produção
   
3. backend-ci-cd.yml
   - Build do backend
   - Testes
   - Deploy para Azure App Service
```

---

## ⚠️ **IMPORTANTE: Não Delete a Branch Antiga**

```
❌ NÃO DELETE: 003-projeto-de-microservi

Motivo:
- Pode ter histórico importante
- Pode ter PRs abertos
- Pode ter referências em issues

✅ MANTENHA: Apenas mude o padrão para "main"
```

---

## 🆘 **Troubleshooting**

### Problema: Não consigo acessar Settings
```
Solução:
- Verificar se você é o owner do repositório
- Verificar permissões da conta (Admin required)
- Se for um fork, você precisa mudar no seu fork
```

### Problema: Não vejo a opção "Branches"
```
Solução:
1. Ir em Settings do repositório (não do perfil)
2. URL deve ser: github.com/le-97/projetoAviacao/settings
3. Menu lateral: "Branches" está logo abaixo de "General"
```

### Problema: Workflows ainda não executam
```
Verificar:
1. Branch padrão foi alterada? (ver no topo da página do repo)
2. Push foi feito para "main"? (não para outra branch)
3. Workflows existem em .github/workflows/? (verificar no repo)
4. Sintaxe YAML está correta? (sem erros no GitHub)
```

---

## ✅ **Checklist de Verificação**

```
[ ] 1. Acessou github.com/le-97/projetoAviacao/settings
[ ] 2. Clicou em "Branches" no menu lateral
[ ] 3. Clicou em "🔄 Switch" ao lado de "003-projeto-de-microservi"
[ ] 4. Selecionou "main" no dropdown
[ ] 5. Clicou em "Update"
[ ] 6. Confirmou com "I understand, update the default branch"
[ ] 7. Verificou que interface do repo mostra "main" como padrão
[ ] 8. Fez um push de teste para verificar workflows
[ ] 9. Workflows executaram automaticamente
[ ] 10. Tudo funcionando! ✅
```

---

## 📚 **Documentação Oficial do GitHub**

- Managing the default branch: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/changing-the-default-branch

---

## 🎯 **Resumo Executivo**

**O que fazer:** Mudar branch padrão de `003-projeto-de-microservi` para `main`

**Onde:** https://github.com/le-97/projetoAviacao/settings/branches

**Por que:** Para workflows executarem automaticamente

**Tempo estimado:** 2 minutos

**Impacto:** ALTO - Corrige problema crítico de CI/CD

---

**STATUS:** ⏳ Aguardando você fazer a mudança no GitHub

**PRÓXIMO PASSO:** Depois que mudar, me avise para continuarmos com as imagens! 🚀
