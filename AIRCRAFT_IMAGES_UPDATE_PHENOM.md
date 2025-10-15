# 🛩️ Relatório: Atualização de Imagens - Jatos Phenom

**Data:** 15 de outubro de 2025  
**Task Taskmaster:** #9 - Update Phenom Jet Images on the Frontend  
**Tag:** `frontend-bugs`  
**Status:** 🔄 Em Progresso

---

## 📊 Análise Atual

### 🔍 Referências no Código

#### 1. HeroCarousel.tsx (linhas 42-44)
**Arquivo:** `src/components/HeroCarousel.tsx`

```typescript
const imageOverrides: Record<string, string> = {
    'Phenom 300': '/planes/phenom300.png',    // ⚠️ ARQUIVO NÃO EXISTE
    'Phenom 500': '/planes/phenom500.png',    // ⚠️ ARQUIVO NÃO EXISTE
    'Phenom 600': '/planes/phenom600.png',    // ⚠️ ARQUIVO NÃO EXISTE
    phenom300: '/planes/phenom300.png',       // ⚠️ ARQUIVO NÃO EXISTE
    phenom500: '/planes/phenom500.png',       // ⚠️ ARQUIVO NÃO EXISTE
    phenom600: '/planes/phenom600.png',       // ⚠️ ARQUIVO NÃO EXISTE
};
```

#### 2. aircraftData.ts (linhas 272-277)
**Arquivo:** `src/data/aircraftData.ts`

```typescript
{
    id: 'phenom-300e',
    model: 'Phenom 300E',
    category: 'executive',
    categoryLabel: 'Aviação Executiva',
    categoryColor: '#003DA5',
    badge: 'Best Seller',
    image: '/planes/phenom300e.png',  // ✅ ARQUIVO EXISTE
    description: 'O jato executivo leve mais entregue do mundo',
    // ...
}
```

---

### 📁 Arquivos Existentes em `/public/planes/`

```
✅ phenom100.png       - Phenom 100 (existe)
✅ phenom300e.png      - Phenom 300E (existe)
❌ phenom300.png       - Phenom 300 (NÃO EXISTE - referenciado no código)
❌ phenom500.png       - Phenom 500 (NÃO EXISTE - referenciado no código)
❌ phenom600.png       - Phenom 600 (NÃO EXISTE - referenciado no código)
✅ praetor500.png      - Praetor 500 (existe)
✅ praetor600.png      - Praetor 600 (existe)
```

**Outros arquivos no diretório:**
- A-29 Super Tucano.jpg
- C-390 Millennium.jpg
- E170.png, E175.png, E175-E2.jpg, E175-E2.png
- E190.png, E190-E2.png
- E195.png, E195-E2.png
- EMB-202 Ipanema.jpg
- KC-390 Millennium.jpg

---

## ⚠️ Problemas Identificados

### 1. **Imagens Phenom Não Existem**
Os arquivos referenciados no código **não existem fisicamente**:
- `/planes/phenom300.png` ❌
- `/planes/phenom500.png` ❌
- `/planes/phenom600.png` ❌

### 2. **Dados Incompletos em aircraftData.ts**
Somente o **Phenom 300E** está cadastrado em `aircraftData.ts`. Faltam:
- Phenom 300 (modelo padrão)
- Phenom 500
- Phenom 600

### 3. **Possível Confusão de Nomenclatura**
- **Phenom 300** vs **Phenom 300E**: São modelos diferentes?
- Pode estar havendo confusão entre os modelos da família Phenom.

---

## 📝 Informação de Contexto: Família Phenom da Embraer

A família de jatos executivos Phenom da Embraer inclui:

### Modelos Reais Existentes:
1. **Phenom 100** (entry-level light jet) ✅
2. **Phenom 300** (light jet - original) ⚠️
3. **Phenom 300E** (versão melhorada do 300) ✅

### Modelos NÃO Existentes:
- **Phenom 500** ❌ - Não existe na linha Embraer
- **Phenom 600** ❌ - Não existe na linha Embraer

**Nota:** A Embraer tem os modelos **Praetor 500** e **Praetor 600** (midsize/super-midsize jets), mas não são da linha Phenom.

---

## 🎯 Ação Requerida do Usuário

### Opção A: Corrigir Nomenclatura (RECOMENDADO)
Se os modelos mencionados são na verdade **Praetor 500** e **Praetor 600**:

1. **Renomear referências no código:**
   - `Phenom 500` → `Praetor 500`
   - `Phenom 600` → `Praetor 600`

2. **Atualizar HeroCarousel.tsx:**
   ```typescript
   const imageOverrides: Record<string, string> = {
       'Phenom 300': '/planes/phenom300e.png',  // usar imagem existente
       'Praetor 500': '/planes/praetor500.png', // já existe
       'Praetor 600': '/planes/praetor600.png', // já existe
   };
   ```

### Opção B: Adicionar Novas Imagens
Se realmente deseja ter modelos "Phenom 500" e "Phenom 600" customizados:

1. **Fornecer URLs ou arquivos das novas imagens:**
   - URL para Phenom 300 atualizado
   - URL para Phenom 500 (se customizado)
   - URL para Phenom 600 (se customizado)

2. **Fazer upload para `/public/planes/`:**
   - `phenom300.png`
   - `phenom500.png`
   - `phenom600.png`

3. **Adicionar dados em aircraftData.ts:**
   ```typescript
   {
       id: 'phenom-500',
       model: 'Phenom 500',
       category: 'executive',
       image: '/planes/phenom500.png',
       description: '...',
       specs: { ... },
   },
   {
       id: 'phenom-600',
       model: 'Phenom 600',
       category: 'executive',
       image: '/planes/phenom600.png',
       description: '...',
       specs: { ... },
   }
   ```

---

## 🌐 URLs para Conferência

### Site em Produção (Azure Static Web Apps)
🔗 **URL Principal:** https://purple-forest-0e3ce441e.1.azurestaticapps.net

### Páginas Relevantes
- **Dashboard Principal (Hero Carousel):**  
  https://purple-forest-0e3ce441e.1.azurestaticapps.net/

- **Aviação Executiva (Aircraft Cards):**  
  https://purple-forest-0e3ce441e.1.azurestaticapps.net/#executive

### Como Conferir Imagens Atuais:
1. Acesse a URL principal
2. Observe o Hero Carousel (carrossel principal)
3. Role até a seção "Aviação Executiva"
4. Verifique os cards dos jatos Phenom/Praetor
5. **Abra DevTools (F12)** → Network → Filtrar por "planes/" para ver quais imagens estão sendo carregadas

---

## 📋 Próximos Passos (Aguardando Definição)

### ✅ Já Realizado:
1. ✅ Análise completa do código
2. ✅ Identificação de arquivos existentes
3. ✅ Mapeamento de referências
4. ✅ Geração de URLs para conferência

### ⏳ Aguardando Usuário:
1. ⏳ **Confirmar nomenclatura correta:**
   - São realmente "Phenom 500/600" ou devem ser "Praetor 500/600"?
   
2. ⏳ **Fornecer URLs das novas imagens:**
   - Se optar por adicionar novas imagens customizadas
   
3. ⏳ **Confirmar abordagem:**
   - Opção A (Corrigir para Praetor) ou Opção B (Adicionar novos Phenom)?

---

## 🔧 Comandos de Desenvolvimento

### Rodar Localmente
```bash
cd aviation-frontend-v2
npm run dev
# Acesse http://localhost:5173
```

### Build de Produção
```bash
npm run build
npm run preview
```

### Verificar Taskmaster
```bash
task-master show 9              # Ver detalhes da task
task-master update-task --id=9 --append --prompt="..."
task-master set-status --id=9 --status=done  # Quando concluir
```

---

## 📊 Status da Task #9

**Task:** Update Phenom Jet Images on the Frontend  
**ID:** 9  
**Status:** 🔄 Em Progresso  
**Prioridade:** 🔴 Alta  
**Criada:** 15/10/2025  

**Bloqueador Atual:**  
⏸️ Aguardando definição do usuário sobre:
1. Nomenclatura correta dos modelos
2. URLs das novas imagens (se aplicável)

---

## 📞 Ações Imediatas Sugeridas

**Para o Usuário:**

1. **Acesse o site atual:**
   - 🌐 https://purple-forest-0e3ce441e.1.azurestaticapps.net
   
2. **Verifique as imagens atuais:**
   - Veja o Hero Carousel
   - Confira a seção Aviação Executiva
   
3. **Defina a abordagem:**
   - Opção A: Corrigir para Praetor 500/600 (RECOMENDADO)
   - Opção B: Fornecer URLs de novas imagens Phenom

4. **Forneça as informações:**
   - Se Opção A: Confirmar que pode renomear
   - Se Opção B: Enviar URLs das 3 imagens

---

**Aguardando retorno para continuar a implementação! 🚀**
