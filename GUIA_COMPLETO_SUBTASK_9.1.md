# 📸 Guia Completo - Subtask 9.1: Adicionar Imagens dos Jatos

**Data:** 15 de outubro de 2025  
**Task:** #9 - Update Phenom Jet Images on the Frontend  
**Subtask:** 9.1 - Add and Optimize New Jet Images  
**Status:** ⏳ PENDING - Aguardando você salvar as imagens

---

## 🎯 Objetivo

Adicionar e otimizar as 3 novas imagens de aeronaves:
1. **Phenom 300E** - Substituir imagem atual
2. **Praetor 500** - Adicionar nova imagem
3. **Praetor 600** - Adicionar nova imagem

---

## 📋 Checklist Rápido

```
[ ] 1. Salvar as 3 imagens em /public/planes/
[ ] 2. Otimizar imagens com TinyPNG
[ ] 3. Atualizar HeroCarousel.tsx (linhas 42-56)
[ ] 4. Atualizar aircraftData.ts (linhas 272, 295, 315)
[ ] 5. Testar localmente (npm run dev)
[ ] 6. Verificar no navegador
[ ] 7. Commit das alterações
[ ] 8. Marcar subtask como done
[ ] 9. Marcar Task #9 como done
[ ] 10. Push para GitHub
```

---

## 🗂️ Passo 1: Salvar as Imagens

### Localização
```
Diretório: aviation-frontend-v2/public/planes/
Caminho completo: C:\Users\lelem\Documents\github\projetoAviacao\aviation-frontend-v2\public\planes\
```

### Opção A: Substituir Arquivos Existentes (Recomendado)
```
Salvar como:
✈️ phenom300e.png     (substituir existente)
✈️ praetor500.png     (substituir existente)
✈️ praetor600.png     (substituir existente)

VANTAGEM: Não precisa alterar código!
```

### Opção B: Criar Novos Arquivos
```
Salvar como:
✈️ phenom300e-new.png
✈️ praetor500-new.png
✈️ praetor600-new.png

DESVANTAGEM: Precisa atualizar 2 arquivos de código
```

**⚠️ RECOMENDAÇÃO: Use a Opção A (substituir existentes)**

---

## 🎨 Passo 2: Otimizar Imagens

### Por que otimizar?
- ⚡ Carregamento mais rápido
- 💾 Menor uso de banda
- 📈 Melhor pontuação Lighthouse
- 🚀 Melhor experiência do usuário

### Como Otimizar

#### Opção 1: TinyPNG (Online) ⭐ RECOMENDADO
```
1. Ir em: https://tinypng.com/
2. Fazer upload das 3 imagens
3. Aguardar compressão automática
4. Baixar imagens otimizadas
5. Salvar em aviation-frontend-v2/public/planes/

Redução esperada: 50-70% do tamanho
Qualidade: Praticamente idêntica
```

#### Opção 2: ImageOptim (Windows/Mac)
```
1. Baixar: https://imageoptim.com/
2. Instalar aplicativo
3. Arrastar as 3 imagens para a janela
4. Aguardar otimização automática
5. Imagens são otimizadas no lugar
```

#### Opção 3: Squoosh (Online)
```
1. Ir em: https://squoosh.app/
2. Upload de uma imagem por vez
3. Ajustar qualidade (80-90%)
4. Baixar versão otimizada
```

### Tamanhos Recomendados
```
Largura máxima: 1920px
Altura máxima: 1080px
Formato: PNG ou WebP
Qualidade: 85-90%
Tamanho ideal: < 500KB por imagem
```

---

## 💻 Passo 3: Atualizar Código (SE USOU OPÇÃO B)

### ⚠️ Só necessário se salvou com nomes diferentes (-new.png)

#### Arquivo 1: HeroCarousel.tsx

**Localização:** `aviation-frontend-v2/src/components/HeroCarousel.tsx`

**Linhas a modificar:** 42-56

```typescript
// ANTES (linhas 42-48):
const imageOverrides: Record<string, string> = {
    'Phenom 300': '/planes/phenom300.png',
    'Phenom 500': '/planes/phenom500.png',
    'Phenom 600': '/planes/phenom600.png',
    phenom300: '/planes/phenom300.png',
    phenom500: '/planes/phenom500.png',
    phenom600: '/planes/phenom600.png',
};

// DEPOIS:
const imageOverrides: Record<string, string> = {
    'Phenom 300E': '/planes/phenom300e-new.png',
    'Praetor 500': '/planes/praetor500-new.png',
    'Praetor 600': '/planes/praetor600-new.png',
    phenom300e: '/planes/phenom300e-new.png',
    praetor500: '/planes/praetor500-new.png',
    praetor600: '/planes/praetor600-new.png',
};
```

```typescript
// ANTES (linhas 50-56):
const includesOverride = modelLower.includes('phenom 300')
    ? '/planes/phenom300.png'
    : modelLower.includes('phenom 500')
        ? '/planes/phenom500.png'
        : modelLower.includes('phenom 600')
            ? '/planes/phenom600.png'
            : undefined;

// DEPOIS:
const includesOverride = modelLower.includes('phenom 300')
    ? '/planes/phenom300e-new.png'
    : modelLower.includes('praetor 500')
        ? '/planes/praetor500-new.png'
        : modelLower.includes('praetor 600')
            ? '/planes/praetor600-new.png'
            : undefined;
```

#### Arquivo 2: aircraftData.ts

**Localização:** `aviation-frontend-v2/src/data/aircraftData.ts`

**Linhas a modificar:** 272, 295, 315 (aproximado)

```typescript
// Phenom 300E (linha ~272)
{
    id: 'phenom-300e',
    model: 'Phenom 300E',
    // ... outros campos
    image: '/planes/phenom300e-new.png',  // ← ATUALIZAR
}

// Praetor 500 (linha ~295)
{
    id: 'praetor-500',
    model: 'Praetor 500',
    // ... outros campos
    image: '/planes/praetor500-new.png',  // ← ATUALIZAR
}

// Praetor 600 (linha ~315)
{
    id: 'praetor-600',
    model: 'Praetor 600',
    // ... outros campos
    image: '/planes/praetor600-new.png',  // ← ATUALIZAR
}
```

---

## 🧪 Passo 4: Testar Localmente

### Iniciar servidor de desenvolvimento
```bash
cd aviation-frontend-v2
npm run dev
```

### Acessar no navegador
```
URL: http://localhost:5173
```

### O que verificar:

#### 1. Hero Carousel (Topo da Página)
```
✅ Imagens carregam corretamente
✅ Qualidade está boa (não pixeladas)
✅ Não há erro 404 no console
✅ Transições funcionam suavemente
✅ Background não tem faixa branca no final ← (Subtask 9.2)
```

#### 2. Seção "Aviação Executiva"
```
✅ Card do Phenom 300E aparece
✅ Cards do Praetor 500 e 600 aparecem
✅ Imagens estão nítidas
✅ Layout está correto
```

#### 3. GitHubMetrics (Subtask 9.4)
```
✅ Mostra "1 Desenvolvedora ativa"
✅ Não mostra mais "3 Desenvolvedores ativos"
```

#### 4. TechStackInfographic (Subtask 9.3)
```
✅ Infográfico aparece no final da página
✅ SVG carrega corretamente
```

#### 5. Footer
```
✅ GitHub icon presente
✅ Link do perfil funciona
✅ Design preservado (não foi alterado)
```

### Abrir DevTools (F12)
```
Console:
  ✅ Sem erros vermelhos
  ✅ Sem avisos de imagens não encontradas
  
Network:
  ✅ Todas as imagens carregam (status 200)
  ✅ Tamanhos das imagens são razoáveis (<500KB)
  
Elements:
  ✅ <img> tags têm src correto
  ✅ alt text está presente
```

---

## 🎯 Passo 5: Lighthouse Audit (Opcional mas Recomendado)

### Como executar
```
1. Abrir DevTools (F12)
2. Ir na aba "Lighthouse"
3. Selecionar:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Clicar em "Analyze page load"
5. Aguardar resultado
```

### Metas
```
Performance:    > 90
Accessibility:  > 95
Best Practices: > 95
SEO:           > 95
```

### Se pontuação for baixa:
```
Performance:
  - Verificar tamanho das imagens
  - Usar TinyPNG novamente
  - Considerar formato WebP

Accessibility:
  - Verificar alt text nas imagens
  - Checar contraste de cores
```

---

## 📝 Passo 6: Commit das Alterações

### Verificar status
```bash
cd aviation-frontend-v2
cd ..
git status
```

### Cenário A: Se usou Opção A (substituiu arquivos)
```bash
# Apenas as imagens foram alteradas
git add aviation-frontend-v2/public/planes/phenom300e.png
git add aviation-frontend-v2/public/planes/praetor500.png
git add aviation-frontend-v2/public/planes/praetor600.png

git commit -m "feat(ui): update optimized aircraft images for Phenom 300E and Praetor jets

- Replaced phenom300e.png with new high-quality image
- Replaced praetor500.png with new high-quality image
- Replaced praetor600.png with new high-quality image
- All images optimized with TinyPNG (50-70% size reduction)
- Maintained image quality while improving load performance

Subtask: 9.1 - Add and Optimize New Jet Images
Task: #9 - Update Phenom Jet Images on the Frontend"
```

### Cenário B: Se usou Opção B (nomes novos + código)
```bash
# Imagens + código foram alterados
git add aviation-frontend-v2/public/planes/phenom300e-new.png
git add aviation-frontend-v2/public/planes/praetor500-new.png
git add aviation-frontend-v2/public/planes/praetor600-new.png
git add aviation-frontend-v2/src/components/HeroCarousel.tsx
git add aviation-frontend-v2/src/data/aircraftData.ts

git commit -m "feat(ui): add optimized aircraft images and update references

- Added phenom300e-new.png (optimized with TinyPNG)
- Added praetor500-new.png (optimized with TinyPNG)
- Added praetor600-new.png (optimized with TinyPNG)
- Updated HeroCarousel.tsx to reference new image paths
- Updated aircraftData.ts with new image paths for all 3 jets
- All images optimized for web (50-70% size reduction)

Subtask: 9.1 - Add and Optimize New Jet Images
Task: #9 - Update Phenom Jet Images on the Frontend"
```

---

## ✅ Passo 7: Atualizar Taskmaster

### Marcar Subtask 9.1 como concluída
```bash
cd aviation-frontend-v2
task-master set-status --id=9.1 --status=done
```

### Marcar Task #9 como concluída
```bash
task-master set-status --id=9 --status=done
```

### Verificar progresso
```bash
task-master show 9
```

**Resultado esperado:** Task #9 com status `done` e 4/4 subtasks concluídas (100%)

---

## 🚀 Passo 8: Push para GitHub

```bash
git push origin main
```

### Monitorar GitHub Actions
```
1. Ir em: https://github.com/le-97/projetoAviacao/actions
2. Verificar workflows:
   - azure-static-web-apps.yml
   - frontend-ci-cd.yml
3. Aguardar conclusão (build + deploy)
4. Status esperado: ✅ Success
```

---

## 🌐 Passo 9: Validar em Produção

### Acessar site em produção
```
URL: https://purple-forest-0e3ce441e.1.azurestaticapps.net
```

### Verificar
```
✅ Hero Carousel carrega novas imagens
✅ Seção "Aviação Executiva" mostra as aeronaves
✅ GitHubMetrics mostra "1 Desenvolvedora ativa"
✅ TechStackInfographic aparece no final
✅ Footer preservado (GitHub icon + perfil)
✅ Sem erros de console
✅ Performance boa (carregamento rápido)
```

---

## 📊 Progresso Final da Task #9

### Antes
```
Task #9: Update Phenom Jet Images on the Frontend
Status: in-progress
Progress: 75% (3/4 subtasks)

✅ Subtask 9.2: Hero Carousel Background - DONE
✅ Subtask 9.3: TechStackInfographic - DONE
✅ Subtask 9.4: GitHubMetrics Update - DONE
⏳ Subtask 9.1: Aircraft Images - PENDING
```

### Depois
```
Task #9: Update Phenom Jet Images on the Frontend
Status: done
Progress: 100% (4/4 subtasks)

✅ Subtask 9.1: Aircraft Images - DONE
✅ Subtask 9.2: Hero Carousel Background - DONE
✅ Subtask 9.3: TechStackInfographic - DONE
✅ Subtask 9.4: GitHubMetrics Update - DONE
```

---

## 🎯 Resumo dos Arquivos

### Arquivos Modificados (Cenário A - Substituir)
```
aviation-frontend-v2/public/planes/phenom300e.png    (substituído)
aviation-frontend-v2/public/planes/praetor500.png    (substituído)
aviation-frontend-v2/public/planes/praetor600.png    (substituído)
```

### Arquivos Modificados (Cenário B - Novos)
```
aviation-frontend-v2/public/planes/phenom300e-new.png    (novo)
aviation-frontend-v2/public/planes/praetor500-new.png    (novo)
aviation-frontend-v2/public/planes/praetor600-new.png    (novo)
aviation-frontend-v2/src/components/HeroCarousel.tsx     (editado)
aviation-frontend-v2/src/data/aircraftData.ts            (editado)
```

---

## ⚠️ Troubleshooting

### Problema: Imagem não aparece (404)
```
Verificar:
1. Nome do arquivo está correto (case-sensitive)
2. Arquivo está em aviation-frontend-v2/public/planes/
3. Path no código começa com /planes/ (não /public/planes/)
4. Extensão do arquivo (.png) está correta
```

### Problema: Imagem pixelada
```
Solução:
1. Verificar resolução original (mínimo 1920x1080)
2. Não comprimir demais no TinyPNG (máx 70%)
3. Usar formato PNG para melhor qualidade
```

### Problema: Página lenta
```
Solução:
1. Otimizar imagens com TinyPNG
2. Reduzir tamanho para < 500KB
3. Considerar formato WebP
4. Verificar Lighthouse Performance score
```

### Problema: ESLint/TypeScript errors
```bash
# Rodar lint
npm run lint

# Rodar TypeScript check
npx tsc --noEmit

# Se houver erros, corrigir antes de commitar
```

---

## 📚 Recursos Úteis

### Otimização de Imagens
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim: https://imageoptim.com/

### Validação
- Lighthouse CI: Built-in no Chrome DevTools (F12)
- WebPageTest: https://www.webpagetest.org/

### Documentação
- React Image Optimization: https://react.dev/learn/rendering-lists
- Vite Assets: https://vitejs.dev/guide/assets.html
- Tailwind Images: https://tailwindcss.com/docs/aspect-ratio

---

## ✅ Checklist Final

Antes de marcar como concluído, verificar:

```
[ ] Imagens salvas em /public/planes/
[ ] Imagens otimizadas (< 500KB cada)
[ ] Código atualizado (se necessário)
[ ] Testado localmente (npm run dev)
[ ] Sem erros no console
[ ] Lighthouse score > 90
[ ] Commit realizado
[ ] Subtask 9.1 marcada como done
[ ] Task #9 marcada como done
[ ] Push para GitHub
[ ] GitHub Actions passed
[ ] Validado em produção
[ ] Tudo funcionando perfeitamente
```

---

**Status Atual:** ⏳ Aguardando você salvar as 3 imagens

**Próximo Passo:** Salvar as imagens em `aviation-frontend-v2/public/planes/` e seguir este guia!

**Boa sorte! 🚀**
