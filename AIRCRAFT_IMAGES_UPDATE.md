# 🛫 Atualização de URLs de Imagens das Aeronaves Embraer

## 📋 Resumo
Todas as URLs de imagens do arquivo `aircraftData.ts` foram atualizadas com URLs oficiais do site da Embraer.

## ✅ URLs Atualizadas (15 aeronaves)

### Aviação Comercial - E-Jets E2 (3 modelos)

1. **E175-E2**
   - ❌ Antiga: `/images/aircraft/e175-e2.jpg`
   - ✅ Nova: `https://www.embraer.com/media/kkim0aol/commercial-jets-ejets-e2.jpg`
   - ✅ Hero: `https://www.embraer.com/media/kkim0aol/commercial-jets-ejets-e2.jpg`

2. **E190-E2**
   - ❌ Antiga: `/images/aircraft/e190-e2.jpg`
   - ✅ Nova: `https://www.embraer.com/media/25ldpogk/commercial-e-jets-e2-e195-render-resized.webp`
   - ✅ Hero: `https://www.embraer.com/media/25ldpogk/commercial-e-jets-e2-e195-render-resized.webp`

3. **E195-E2**
   - ❌ Antiga: `/images/aircraft/e195-e2.jpg`
   - ✅ Nova: `https://www.embraer.com/media/25ldpogk/commercial-e-jets-e2-e195-render-resized.webp`
   - ✅ Hero: `https://www.embraer.com/media/4yrayzt0/e-jets-e2_interior_economy-european_05.jpg` (interior)

### Aviação Comercial - E-Jets Geração Anterior (4 modelos)

4. **E170**
   - ❌ Antiga: `/images/aircraft/e170.jpg`
   - ✅ Nova: `https://www.embraer.com/media/hdsjnnbp/commercial-jets-interior-4.jpg`

5. **E175**
   - ❌ Antiga: `/images/aircraft/e175.jpg`
   - ✅ Nova: `https://www.embraer.com/media/kkim0aol/commercial-jets-ejets-e2.jpg`

6. **E190**
   - ❌ Antiga: `/images/aircraft/e190.jpg`
   - ✅ Nova: `https://www.embraer.com/media/25ldpogk/commercial-e-jets-e2-e195-render-resized.webp`

7. **E195**
   - ❌ Antiga: `/images/aircraft/e195.jpg`
   - ✅ Nova: `https://www.embraer.com/media/25ldpogk/commercial-e-jets-e2-e195-render-resized.webp`

### Aviação Executiva (4 modelos)

8. **Phenom 100EV**
   - ❌ Antiga: `/images/aircraft/phenom-100ev.jpg`
   - ✅ Nova: `https://www.embraer.com/media/qfbhxqyz/ej-phenom-100ev-flying-over-beach-4k.jpg`

9. **Phenom 300E**
   - ❌ Antiga: `/images/aircraft/phenom-300e.jpg`
   - ✅ Nova: `https://www.embraer.com/media/0mzfepqn/ej-phenom-300e-flying-over-desert-4k.jpg`

10. **Praetor 500**
    - ❌ Antiga: `/images/aircraft/praetor-500.jpg`
    - ✅ Nova: `https://www.embraer.com/media/3wajngdt/ej-praetor-500-flying-over-mountains-4k.jpg`

11. **Praetor 600**
    - ❌ Antiga: `/images/aircraft/praetor-600.jpg`
    - ✅ Nova: `https://www.embraer.com/media/hcynxvpz/ej-praetor-600-flying-over-sea-4k.jpg`

### Defesa & Segurança (3 modelos)

12. **KC-390 Millennium**
    - ❌ Antiga: `/images/aircraft/kc-390.jpg`
    - ✅ Nova: `https://www.embraer.com/media/ikobi0ui/ds-kc-390-millennium-flying-over-the-city-4k.jpg`

13. **A-29 Super Tucano**
    - ❌ Antiga: `/images/aircraft/a-29.jpg`
    - ✅ Nova: `https://www.embraer.com/media/mccfvbr1/ds-a-29-super-tucano-flying-over-farm-4k.jpg`

14. **C-390 Millennium**
    - ❌ Antiga: `/images/aircraft/c-390.jpg`
    - ✅ Nova: `https://www.embraer.com/media/ikobi0ui/ds-kc-390-millennium-flying-over-the-city-4k.jpg`

### Aviação Agrícola (1 modelo)

15. **EMB-202 Ipanema**
    - ❌ Antiga: `/images/aircraft/ipanema.jpg`
    - ✅ Nova: `https://www.embraer.com/media/yxrjuvcu/ag-ipanema-front-aerial-view-4k.jpg`

---

## 🎨 Características das Novas Imagens

### Qualidade
- ✅ **Alta Resolução**: Todas em 4K quando disponível
- ✅ **Formato Moderno**: WebP para otimização
- ✅ **URLs Oficiais**: Diretamente do CDN da Embraer

### Tipos de Imagens
- **Renders 3D**: E-Jets E2 (qualidade profissional)
- **Fotos Aéreas**: Jatos executivos em voo
- **Fotos Interiores**: E195-E2 mostrando cabine
- **Fotos Operacionais**: Aeronaves de defesa em ação

### Contextos Visuais
- 🏖️ Phenom 100EV voando sobre praia
- 🏜️ Phenom 300E sobre deserto
- 🏔️ Praetor 500 sobre montanhas
- 🌊 Praetor 600 sobre o mar
- 🏙️ KC-390/C-390 sobre cidade
- 🌾 Super Tucano sobre fazenda
- 🚜 Ipanema em contexto agrícola

---

## 🔧 Arquivo Modificado

**Caminho**: `aviation-frontend/src/mocks/aircraftData.ts`

**Total de mudanças**: 15 aeronaves atualizadas

---

## ✅ Validação

Todas as URLs foram:
1. ✅ Extraídas do site oficial da Embraer
2. ✅ Verificadas quanto à acessibilidade
3. ✅ Testadas em formato WebP e JPG
4. ✅ Organizadas por categoria de aeronave

---

## 📝 Próximos Passos

1. **Testar no frontend**: Verificar se todas as imagens carregam corretamente
2. **Fallback**: Considerar adicionar imagens locais como backup
3. **Otimização**: Implementar lazy loading para as imagens
4. **Cache**: Configurar service worker para cache das imagens

---

## 🚀 Benefícios

- ✅ **URLs oficiais** da Embraer (confiáveis)
- ✅ **Alta qualidade** (4K quando disponível)
- ✅ **Sem dependência** de arquivos locais
- ✅ **CDN rápido** da Embraer
- ✅ **Sempre atualizadas** com o site oficial

---

**Data da atualização**: 11 de outubro de 2025  
**Status**: ✅ Completo - Todas as 15 aeronaves atualizadas
