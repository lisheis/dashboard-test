# Neon Finance Dashboard

O **Neon Dashboard** é uma plicação corporativa e Pixel-Perfect de análise financeira pessoal, executada em React + Vite. Seu layout é rigorosamente inspirado num grid responsivo modular, entregando uma interface hiper-escura acentuada por cores Ciano e Magenta, livre de poluição visual (como linhas de grade excessivas).

## 🚀 Instalação e Inicialização Rápida (Quick Start)

Ambiente necessário: Node 16+

```bash
# 1. Instalar as dependências globais e de interface do projeto
npm install

# 2. Configurar Variáveis de Ambiente locais baseadas no modelo (Mock Seguro)
cp .env.example .env

# 3. Rodar o Dev Server na sua porta local (geralmente localhost:5173)
npm run dev
```

## 🏗 Como os Dados Fluem no Backend do App?

O projeto ignora hooks sujos. Todos os dados respeitam o princípio de **Extração-Transformação-Carga (Data Pipeline)**:
1. **RAW:** Os dados brutos entram isoladamente simulados na pasta `src/data/raw/transactions.json`.
2. **EXTRACTOR:** A camada em `src/services/extractor.ts` filtra os objetos para o "Tempo Selecionado" na Sidebar. Cálculos de arrays pesados rodam apenas ali, limpos e isolados via TypeScript.
3. **TRANSFORMER:** O serviço `transformers.ts` varre a lista gerada no extrator, transformando-a geometricamente em arrays exatos que comporão as Coordenadas `{ x, y }` consumidas instantaneamente pelos ApexCharts.

Se deseja maior nível de detalhes, como acoplar seu Backend Live (API), leia a [DOCUMENTAÇÃO DETALHADA TÉCNICA (Nível Engenharia) AQUI!](./DOCUMENTACAO_DETALHADA.md).
