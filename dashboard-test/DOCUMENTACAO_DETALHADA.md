# 📖 Documentação Detalhada de Arquitetura do Neon Finance

Bem-vindo ao material corporativo desenvolvido para descrever minuciosamente cada tomada de decisão, arquitetura matemática e design patterns injetados no Pipeline deste Painel. Se você é um Engenheiro de Software ou Staff buscando integrar este frontend puro ao seu microserviço, este é o guia definitivo.

---

## 1. Replicação Visual e Arquitetura Front-end (Atomic Pattern)

O dashboard baseia-se numa malha `grid-cols-12`, mantendo a consistência visual em larguras extremas sem quebrar o preenchimento flexível. Utilizamos Tailwind CSS não apemas para responsividade, mas como *tokens* de design centralizado.

### Fidelidade de Composição (Dark Pixel-Perfect)
A interface adota a técnica *Dark Space*. Cartões modulares (e os blocos dos componentes puros) substituíram Glassmorphism pesado por um background contínuo sólido e escuro (`#161922`), margeados por uma tênue linha `border-[rgba(255,255,255,0.05)]`. 

Isso resulta num altíssimo contraste com os números pesados (font-bold brancos) e títulos submissos acinzentados (Tailwind `#9CA3AF`). Cores neon puras (Azul `#3B82F6` / Magenta `#D946EF`) não são recheios textuais, servem **somente** para apontar indicadores-chave (gráficos area-fill e progresso).

### Estrutura (Service UI Layering)
Os cartões Apex não realizam matemática. A pasta `src/components/charts/` possui unicamente mapeamento de *Props* e *Options* de exibição do ApexCharts. 
O Hook mestre em `src/hooks/useDashboardData.ts` opera como Maestro, acoplado ao Page Context único de `Dashboard.tsx`. Modificações lógicas nunca devem poluir JSX ou CSS.

---

## 2. A Camada de Dados Oculta (Pipeline de ETL)

Construímos dois motores silenciosos baseados nos princípios mais sólidos de engenharia de dados, abstraindo da UI qualquer "peso":

- **O Motor de Extração (src/services/extractor.ts):**
  Agrupamos por `filterTransactionsByPeriod()`, garantindo complexidade algorítmica exata O(N). Todo ano (selecionado na barra lateral) e mês processado desce até este funil que, ao aplicar isolamento temporal usando APIs de Data (date-fns e `getUTCFullYear`), protege a UI de inconsistências temporais de fuso-horário de servidores em provedores de Cloud.

- **Os Transformadores Geométricos (src/services/transformers.ts):**
  Cada card tem o seu Transformer.
  - Para o Card **"Análise Mensal"**, a tela precisa de eixos verticais mensais. A `transformToMonthlySeries` injeta arrays limpos da base num `map()` cronológico estrito de meses de 0 a 11.
  - O donut **"Participação na base anual"** usa a função `transformCategoryDistribution()`, encarregada de puxar da camada iterativa `.reduce` todo o volume de mercado para cada categoria atrelada ao total bruto e transformar isso em porcentagens estritas (`percentages`) mapeadas nas *labels*. É aqui onde "Taxa de Poupança", e "Saldo Líquido", os KPIs brutos numéricos, tomam a forma percentual pronta (`netBalance / income * 100`).

---

## 3. Contratos de Dados Globais e Substituindo por Back-End Vivo

Substituir o Mock local (`transactions.json`) por um Data Lake Real provido por sua API é desenhado para não gerar "Debt", refatorações ou reescritas do Frontend! O contrato exigido pela arquitetura visual restringe-se a enviar ao Extractor um Payload Array no formato:

```typescript
export interface RawTransaction {
  id: string;
  date: string; // ISO 8601 strict format
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
}
```

### Configurando o `.env` para Produção Pura
As referências às URLs ocultas encontram-se estruturalmente no arquivo `.env`. Para realizar a troca completa do dado fixo pela Nuvem, alterne sua chave local simulada no ambiente:

1. No root `.env`, confirme ou troque as chaves críticas `VITE_ENABLE_MOCK_DATA=false`.
2. Configure o seu target REST `VITE_API_URL=https://prod.seubanco.com.br/v1`.
3. Navegue para o gancho de contexto `src/hooks/useDashboardData.ts` e altere a fonte `mockData`:
   
```typescript
// Fetching API assíncrono via Browser Nativo:
const response = await fetch(`${import.meta.env.VITE_API_URL}/transactions/user/${userId}`);
const payloadDaSuasTabelas = await response.json();

// Descarte a importação do JSON Local e insira a Payload diretamente. Zero código UI alterado.
const allTx = extractAllTransactions(payloadDaSuasTabelas);
```

As renderizações contínuas de telas se adaptam, reagindo integralmente ao estado assíncrono final (graças ao interceptador visual nativo `isLoading`). O componente isolará o DOM até que ETL sinalize `green`. Isso entrega um produto final inquebrável, com alto FPS aos navegadores e preparado para milhões de linhas base.
