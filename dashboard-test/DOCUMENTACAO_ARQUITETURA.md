# 📖 Documentação Detalhada de Arquitetura

Bem-vindo ao material de referência para o  Dashboard. Este documento serve como guia principal e manual tático do engenheiro para justificar a nossa abordagem modular, fluxos de ETL, e design visual arrojado.

---

## 1. Contexto Front-end (Design UI/UX)

### Glassmorphism & Modo Escuro (Dark Mode Neon)
Construímos uma Interface Gráfica farta baseada nos fundamentos visuais de **Glassmorphism**. A identidade usa um Fundo Profundo (`#0B0C10`), e destaques primários utilizando Azul Neon (`#00E5FF`) e Rosa Neon (`#FF007A`).

**Como funciona tecnicamente a UI?**
Utilizamos a técnica de mesclagem do TailwindCSS via extensões personalizadas no `tailwind.config.js`. Cartões utilizam:
```css
/* Definições utilitárias no index.css */
.glass-card {
  @apply bg-glass border border-glass-border backdrop-blur-glass shadow-xl;
}
```
Isso exige zero sobrecarga ao React Render Engine: delegamos as renderização das sombras neon e dos desfoques de vidro fosco inteiramente para as abstrações nativas criadas em CSS-in-Class no DOM. Todos os elementos atômicos estão na pasta `src/components/ui/`, reativos em estado de "hover" e inteiramente responsivos.

---

## 2. Padrão de Engenharia (A Jornada ETL)

O principal diferencial estruturante deste Sistema é tratar dados como fluxos injetáveis. Ao invés da tela reagir e interagir com as funções complexas, adotamos o Fluxo Unidirecional Isolado:

### Etapa 1: A Captura na Camada RAW (`src/data/raw`)
Pacotes JSON estáticos temporários vivem aqui simulando o recebimento direto e puro de um banco REST. 

### Etapa 2: A Limpeza no Extractor (`src/services/extractor.ts`)
A função do extrator é a **Lógica de Negócio (Business Logic)** primária. Trabalha com O(1) e O(N log N) onde convertemos arrays primitivos (e strings datadas complexas como `ISO-8601`) isolando registros indesejados. É nessa camada que **filtramos por Mês e Ano**, e extraímos listas limpas (`extractRecentTransactions`) sem deixar de manter a rigidez na Regra de Negócio principal. É o nosso "Validation Shield".

### Etapa 3: Modelagem em Transformers (`src/services/transformers.ts`)
Aqui calculamos toda matemática relativa a interface e moldamos "Transformers". O `transformToAreaChart` recalcula 12 milissegundos criando baldes cronológicos temporais (Key/Value mapping de `'MMM yyyy'`). Ele devolve uma abstração que as telas (inclusive a UI burra dos ApexCharts) podem somente plugar via `{ x, y }` sem questionar como a lógica foi modelada. 

### Etapa 4: Reatividade via Hooks e Pages (`src/pages/Dashboard.tsx`)
A Página principal (`Dashboard.tsx`) aciona todo esse maquinário usando o `useDashboardData.ts`. Ele encapsula simulações de fetch (atraso intencional mostrando Loader), preenche simultaneamente estatísticas puras, matrizes das linhas de gráfico longo e fatias do Donut. Quando tudo foi processado e formatado, a tela injeta nos componentes modulares sob uma interface unicamente Portuguesa.

---

## 3. Lógica dos Componentes (KPIs)

Toda modelagem matemática opera de forma paralela via `.reduce` nos `transformers`. 

- **Saldo Líquido:** Diferença bruta exata (`totalIncome - totalExpenses`).
- **Despesas / Receitas Totais (Fluxo Absoluto):** Filtro em array de tudo marcado com a tag `"type": "expense"`/`income` com redutor matemático O(N) somando seus montantes brutos.
- **Taxa de Poupança (Savings Rate):** Condicional protetiva: se a Receita Total for maior que zero, calcula-se a relação `(Saldo / Receita) * 100`, barrando casos onde o retorno matemático daria divisões negativas inválidas ou infinitas em javascript.
- **Gráficos Dinâmicos:** Usando o `date-fns` no Transformer, toda métrica de exibição dos ApexCharts (`DonutChart e AreaChart`) foi forçadamente injetada para pt-BR. O Gráfico reage a essa formatação usando o padrão Brasileiro absoluto `Intl.NumberFormat('pt-BR')`.

---

## 4. Segurança e Integração Real de Backend (.env)

Em ambientes profissionais de larga escala, nunca deixamos conexões de APIs explicitas no código. Os engenheiros criaram na raiz o arquivo restrito `.env`.

**Processo para plugar um Backend REST / GraphQL Real:**
A lógica prevê a flexibilidade extrema da "Arquitetura Hexagonal".

1. Troque o valor de `VITE_ENABLE_MOCK_DATA` para `false` no seu `.env`.
2. Determine como `VITE_API_URL=https://api.neon.com/v1/sua_rota` o endpoint principal de consumo bancário.
3. No arquivo `src/hooks/useDashboardData.ts`, substitua a variável provisória `mockData` pela função real de fetch local (p.ex., via Axios), jogando a resposta crua para `extractAllTransactions(apiPayload)`.

A mágica do Clean Code neste sistema reside numa afirmação forte: você migrará de JSON simulado para um Banco de Dados Global **sem alterar ou corromper sequer nenhuma função no render de qualquer página .TSX da nossa pasta /components.**
