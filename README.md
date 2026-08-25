# Sistema de Orçamentos e Captação de Clientes

Sistema web full-stack desenvolvido para empresas de instalação e manutenção de ar-condicionado, com foco em captação de clientes, gerenciamento de leads e organização de solicitações de orçamento.

O sistema permite que potenciais clientes solicitem um orçamento através de um formulário online, enquanto a empresa pode visualizar e gerenciar essas solicitações através de um painel administrativo.

---

## Sobre o projeto

A aplicação foi desenvolvida simulando uma solução real para uma empresa de instalação e manutenção de ar-condicionado.

O cliente acessa o site e pode solicitar um orçamento informando:

- Nome
- WhatsApp
- Cidade
- Tipo de serviço
- Descrição do problema
- Fotografias

Após o envio, os dados são armazenados e o lead fica disponível no painel administrativo da empresa.

O objetivo é centralizar a captação de clientes e facilitar o acompanhamento das solicitações recebidas.

---

## Funcionalidades

### Área do cliente

- Solicitação de orçamento
- Cadastro de nome
- Cadastro de WhatsApp
- Cadastro de cidade
- Seleção do tipo de serviço
- Descrição do problema
- Envio de fotografias
- Validação dos dados enviados

### Painel administrativo

- Visualização dos leads recebidos
- Busca por cliente
- Busca por cidade
- Busca por serviço
- Busca por WhatsApp
- Filtro por status
- Visualização dos dados do cliente
- Visualização da descrição do problema
- Visualização das fotos enviadas
- Contato direto pelo WhatsApp
- Alteração do status do lead

### Status dos leads

O sistema permite acompanhar o estágio de cada solicitação através dos seguintes status:

- Novo
- Em contato
- Orçamento enviado
- Fechado
- Cancelado

---

## Fluxo do sistema

```text
                    CLIENTE
                       │
                       ▼
             ┌───────────────────┐
             │ Solicita orçamento│
             └─────────┬─────────┘
                       │
                       ▼
             ┌───────────────────┐
             │ Nome              │
             │ WhatsApp          │
             │ Cidade            │
             │ Serviço           │
             │ Descrição         │
             │ Fotos             │
             └─────────┬─────────┘
                       │
                       ▼
             ┌───────────────────┐
             │ API / Backend     │
             └─────────┬─────────┘
                       │
                       ▼
             ┌───────────────────┐
             │ Banco de dados    │
             └─────────┬─────────┘
                       │
                       ▼
             ┌───────────────────┐
             │ Painel da empresa │
             └─────────┬─────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
      Entrar em contato    Gerenciar lead
```

---

## Tecnologias utilizadas

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **SQLite**
- **Next.js API Routes**
- **ESLint**

---

## Arquitetura

O projeto utiliza o **Next.js App Router**, organizando a aplicação entre interface, rotas da API e camada de persistência.

### Front-end

- React
- TypeScript
- Tailwind CSS
- Next.js App Router

### Back-end

- Next.js API Routes
- TypeScript
- Prisma ORM

### Banco de dados

Durante o desenvolvimento foi utilizado **SQLite** como banco de dados local e temporário.

O banco de dados local não é versionado no GitHub.

As migrations do Prisma são versionadas para permitir que o banco possa ser recriado em outro ambiente.

---

## Estrutura do projeto

```text
sistema-orcamentos/
│
├── app/
│   ├── api/
│   │   └── leads/
│   │
│   ├── painel/
│   │   └── leads/
│   │
│   ├── solicitar-orcamento/
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── prisma.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│
├── src/
│   └── generated/
│       └── prisma/
│
├── .env
├── .gitignore
├── package.json
├── prisma.config.ts
└── README.md
```

> A estrutura pode sofrer alterações conforme o desenvolvimento do projeto.

---

## Principais telas

### Solicitação de orçamento

Interface destinada ao cliente para envio de uma solicitação de orçamento.

O formulário coleta as informações necessárias para que a empresa possa avaliar o serviço solicitado.

### Painel administrativo

Interface destinada à empresa para visualizar e gerenciar os leads recebidos.

O painel apresenta informações como:

- Nome do cliente
- WhatsApp
- Cidade
- Serviço solicitado
- Descrição do problema
- Fotos
- Data da solicitação
- Status do lead

Também é possível realizar buscas, filtrar solicitações e entrar em contato com o cliente através do WhatsApp.

---

## Banco de dados

O projeto utiliza **Prisma ORM** para comunicação com o banco de dados SQLite.

### Principais entidades

#### Lead

Representa uma solicitação de orçamento feita por um cliente.

Principais informações:

- Identificador
- Nome
- WhatsApp
- Cidade
- Tipo de serviço
- Descrição
- Status
- Data de criação
- Data de atualização

#### LeadPhoto

Representa uma fotografia associada a um lead.

Principais informações:

- Identificador
- Nome do arquivo
- Caminho do arquivo
- Lead relacionado
- Data de criação

---

## Segurança e arquivos locais

Arquivos contendo informações locais ou sensíveis não devem ser enviados ao repositório.

O projeto utiliza `.gitignore` para evitar o versionamento de arquivos como:

```text
node_modules/
.next/
.env
.env.local
prisma/*.db
prisma/*.db-journal
```

O banco SQLite utilizado durante o desenvolvimento também não é enviado ao GitHub.

---

## Como executar

### Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- Git

---

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/sistema-orcamentos.git
```

Entre na pasta do projeto:

```bash
cd sistema-orcamentos
```

---

### 2. Instalar as dependências

```bash
npm install
```

---

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./prisma/dev.db"
```

---

### 4. Criar o banco de dados

Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

---

### 5. Gerar o Prisma Client

```bash
npx prisma generate
```

---

### 6. Executar o projeto

```bash
npm run dev
```

O projeto estará disponível em:

```text
http://localhost:3000
```

---

## Rotas principais

### Área pública

```text
/
```

Página inicial do sistema.

```text
/solicitar-orcamento
```

Página utilizada pelo cliente para solicitar um orçamento.

### Área administrativa

```text
/painel
```

Painel para gerenciamento dos leads.

---

## API

O projeto utiliza rotas de API do próprio Next.js para comunicação entre a interface e o backend.

As APIs são responsáveis por operações relacionadas aos leads, como:

- Criação de leads
- Consulta de leads
- Consulta individual
- Atualização de informações
- Atualização de status

---

## Objetivo

Este projeto foi desenvolvido como projeto de portfólio para demonstrar conhecimentos em desenvolvimento web full-stack.

Entre os principais conceitos utilizados estão:

- Desenvolvimento de aplicações com Next.js
- React
- TypeScript
- Criação de APIs
- Integração com banco de dados
- ORM com Prisma
- Modelagem de dados
- Operações CRUD
- Gerenciamento de estado
- Validação de formulários
- Interfaces responsivas
- Integração entre front-end e back-end
- Organização de projetos web

---

## Status

**Projeto em desenvolvimento.**

A versão atual possui a estrutura principal de captação de clientes e gerenciamento de leads.

Novas funcionalidades podem ser adicionadas futuramente, como:

- Autenticação administrativa
- Geração de orçamentos
- Envio de notificações
- Implantação em ambiente de produção

---

## Projeto de portfólio

Este projeto foi desenvolvido para fins de estudo, prática e demonstração de habilidades de desenvolvimento web full-stack.

A aplicação simula um produto que poderia ser utilizado por uma empresa real para centralizar a captação e gerenciamento de clientes.

---

## Autor

**Heriky Lopes**

Desenvolvedor Full-Stack

---

## Licença

Este projeto foi desenvolvido para fins de estudo e portfólio.