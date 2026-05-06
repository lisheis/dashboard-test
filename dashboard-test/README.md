# Dashboard Financeiro Neon (Quick Start)

Este projeto é um painel financeiro altamente modular, projetado utilizando as melhores práticas do Glassmorphism e Dark UI, construído em React + Vite. O código foi arquitetado focando no padrão "Clean Code", com separação rigorosa de funções de Negócio (ETL) e de Interface.

> Para detalhes em profundidade sobre a Arquitetura (Extratores, State Hooks e Segurança de Tokens), verifique a [Documentação Detalhada](./DOCUMENTACAO_DETALHADA.md).

## ⚡ Instalação e Inicialização Rápida

Siga este passo a passo para configurar o Dashboard na sua máquina.

### 1. Requisitos
- Node.js instalado (Versão 16 ou superior).

### 2. Rodar o Projeto
No terminal do próprio VS Code ou no seu console favorito:

```bash
# Navegue até a raiz do projeto (se já não estiver nela)
cd dashboard-test

# Instale os pacotes principais contidos no package.json
# (Vite, React, Tailwind, ApexCharts, Lucide Icons, Date-fns, etc.)
npm install

# Inicie o servidor em ambiente local
npm run dev
```
Após o comando `dev`, no console aparecerá um link do `localhost` (como `http://localhost:5173`). Basta clicar ou acessar pelo navegador.

### 3. Configurando o Ambiente Seguro (.env)
A aplicação necessita de configurações de ambiente simulando um contexto de mercado, provendo segurança às credenciais do Front-end:

Copie e cole o nosso arquivo modelo enviando-o para um arquivo local não versionado:
```bash
cp .env.example .env
```
*(Confira se no arquivo `.env` gerado a propriedade `VITE_ENABLE_MOCK_DATA` está `true` para utilizar o banco cru em JSON `src/data/raw/transactions.json` neste primeiro teste).*

Pronto! Seu ambiente local em Português já está configurado.
