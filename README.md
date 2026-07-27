# Banco API Tests 🏦

Testes automatizados de API para a **API de Transferências Bancárias** (v2.0.0), escritos em **Node.js** com **Mocha + Chai + Supertest**.

O projeto vai além do caminho feliz: cobre validação de contrato, regras de negócio, autenticação/autorização e cenários de segurança derivados da análise do Swagger (`banco-swagger.json`) com as heurísticas **VADER** e **POISED**.

## 📋 Sobre o projeto

A API sob teste é a [**banco-api**, de Júlio de Lima](https://github.com/juliodelimas/banco-api) — ela permite login com autenticação JWT, consulta de contas e criação/consulta de transferências. Os testes deste repositório validam esses fluxos comparando o comportamento real da API com o que está documentado no contrato OpenAPI incluído na raiz do projeto.

Esta suíte **não sobe a API**: ela aponta para uma instância já em execução. O passo a passo para colocar a API no ar está na seção [Subindo a API sob teste](#-subindo-a-api-sob-teste).

**29 testes automatizados** distribuídos em 3 suítes:

| Suíte | Arquivo | Testes |
|-------|---------|--------|
| Login | `test/login.test.js` | 8 |
| Contas | `test/conta.test.js` | 11 |
| Transferências | `test/transferencia.test.js` | 10 |

## 🛠️ Tecnologias

- **Node.js** — runtime JavaScript
- **Mocha** — framework de testes
- **Chai** — biblioteca de asserções (`expect`)
- **Supertest** — cliente HTTP para testes de API
- **Dotenv** — variáveis de ambiente
- **Mochawesome** — relatório visual em HTML

## 📁 Estrutura

```
banco-api-tests/
├── config/
│   ├── ambiente.js             # Instância única do Supertest + resolução da baseURL
│   └── config.example.json     # Template de configuração local (versionado)
├── fixtures/
│   ├── postLogin.json          # Formato do payload de login (valores vêm do ambiente)
│   └── postTransferencias.json # Payload base de transferência
├── helpers/
│   └── autenticacao.js         # obterToken() — geração de token reutilizável
├── test/
│   ├── login.test.js           # POST /login e verbo não documentado
│   ├── conta.test.js           # GET /contas e GET /contas/{id}
│   └── transferencia.test.js   # POST/GET /transferencias e GET /transferencias/{id}
├── banco-swagger.json          # Contrato OpenAPI da API sob teste
├── .env.example                # Template das variáveis de ambiente (versionado)
├── package.json
└── .gitignore
```

## ✅ Boas práticas aplicadas

Estas são as decisões de organização adotadas no projeto — elas explicam por que os arquivos estão distribuídos dessa forma:

- **Configuração centralizada** (`config/ambiente.js`): a `baseURL` é resolvida em um único lugar e exportada como uma instância pronta do Supertest (`api`), consumida por todas as suítes e também pelo helper de autenticação. Nenhum teste conhece a URL da API — trocar de ambiente não exige tocar em arquivo de teste.
- **Configuração flexível e à prova de clone limpo**: `.env` e `config.local.json` são intercambiáveis, o caminho do arquivo local é resolvido a partir de `__dirname` (a suíte roda de qualquer diretório) e a ausência de configuração produz uma mensagem de erro acionável, não um `ENOENT`.
- **Segredos e configuração local fora do versionamento**: `.env` e `config/config.local.json` estão no `.gitignore`. O repositório versiona apenas os templates `.env.example` e `config/config.example.json`.
- **Credenciais fora do código**: o usuário e a senha válidos vêm do ambiente, expostos como `credenciais` pelo `config/ambiente.js`. Nenhum arquivo de teste contém credencial real — só permanecem literais os valores inválidos de propósito, que definem o cenário do teste.
- **Fixtures externas** (`fixtures/`): os payloads ficam em JSON, separados da lógica de teste.
- **Fixtures imutáveis**: cada teste trabalha sobre uma cópia (`{ ...postLogin }`) em vez de alterar o objeto importado, evitando vazamento de estado entre testes.
- **Helper de autenticação** (`helpers/autenticacao.js`): o login é encapsulado em `obterToken()` e chamado no `beforeEach`, eliminando duplicação de setup nas suítes.
- **Testes organizados por endpoint**: `describe` aninhado por recurso e método HTTP, o que deixa o relatório legível.
- **Nomes de teste descritivos**: cada `it` declara o comportamento esperado, o código de status e a condição — o nome já documenta o cenário.
- **Cobertura guiada por heurísticas**: os cenários derivam da aplicação de **VADER** e **POISED** sobre o contrato OpenAPI, e não de escolhas ad hoc — o que traz cenários negativos, de contrato e de segurança (ver abaixo).
- **Relatório fora do Git**: `mochawesome-report/` é ignorado.

## 🚀 Subindo a API sob teste

A API não faz parte deste repositório. Ela vive em [github.com/juliodelimas/banco-api](https://github.com/juliodelimas/banco-api) e precisa estar rodando antes de você executar a suíte.

### Pré-requisitos da API

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) — a API persiste contas, usuários e transferências em banco relacional

### 1. Clone e instale a API

```bash
git clone https://github.com/juliodelimas/banco-api.git
cd banco-api
npm install
```

### 2. Crie o `.env` da API

Na raiz do `banco-api`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=banco
JWT_SECRET=sua_chave_secreta
PORT=3000
GRAPHQLPORT=3001
```

### 3. Crie o banco e as tabelas

```sql
CREATE DATABASE banco;
USE banco;

CREATE TABLE contas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titular VARCHAR(100) NOT NULL,
    saldo DECIMAL(10, 2) NOT NULL,
    ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE transferencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conta_origem_id INT NOT NULL,
    conta_destino_id INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    autenticada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (conta_origem_id) REFERENCES contas(id),
    FOREIGN KEY (conta_destino_id) REFERENCES contas(id)
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
```

### 4. Popule a massa de teste

As tabelas nascem vazias — sem nenhum usuário cadastrado o login falha e a suíte inteira cai junto. A massa abaixo é o mínimo para a suíte conseguir executar:

```sql
USE banco;

INSERT INTO usuarios (username, senha) VALUES ('julio.lima', '123456');

INSERT INTO contas (id, titular, saldo, ativa) VALUES
    (1, 'Júlio de Lima', 6171.13, TRUE),
    (2, 'Pamela T. F.', 4523.77, TRUE);

INSERT INTO transferencias (conta_origem_id, conta_destino_id, valor) VALUES
    (1, 2, 8564.86), (2, 1, 120.00), (1, 2, 75.50), (2, 1, 310.20),
    (1, 2, 45.00), (2, 1, 980.10), (1, 2, 33.33), (2, 1, 210.90),
    (1, 2, 60.00), (2, 1, 150.75), (1, 2, 88.20), (2, 1, 400.00);
```

O que cada parte sustenta:

| Massa | Testes que dependem dela |
|-------|---------------------------|
| Usuário `julio.lima` / `123456` | Login com credenciais válidas e o `beforeEach` de todas as suítes autenticadas |
| Exatamente 2 contas ativas | Listagem de contas e transferências entre origem e destino |
| Conta `1` com saldo `6171.13` | Consulta de conta por id, que valida o saldo |
| Transferência `1` de `1` → `2` no valor `8564.86` | Consulta de transferência por id |
| Pelo menos 12 transferências | Paginação com `limit=10` |

> ⚠️ Os testes de transferência movimentam saldo de verdade. Depois de uma execução completa, os valores do banco mudam e as asserções de saldo passam a falhar. Para repetir a suíte do zero, recrie a massa (`TRUNCATE` nas tabelas e rode os `INSERT` de novo) ou ajuste os valores esperados nos testes. Tornar a suíte independente de massa fixa está no [backlog](#️-próximos-passos).

### 5. Suba a API REST

Na raiz do `banco-api`:

```bash
npm run rest-api
```

A API sobe em `http://localhost:3000` e a documentação interativa fica em [http://localhost:3000/api-docs](http://localhost:3000/api-docs). Deixe esse terminal aberto — é o servidor rodando.

> O repositório da API também expõe uma versão GraphQL na porta `3001` (`npm run graphql-api`), que **não** é usada por esta suíte.

## 📦 Instalação da suíte de testes

### Pré-requisitos

- Node.js 18 ou superior
- npm
- A API bancária rodando localmente (passo anterior), por padrão em `http://localhost:3000`

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/pamelatf/banco-api-tests.git
cd banco-api-tests
```

2. Instale as dependências:

```bash
npm install
```

3. Configure a URL e as credenciais da API. Basta **uma** das duas opções abaixo:

   **Opção A — arquivo `.env` na raiz** (recomendada para CI), criado a partir do template versionado:

   ```bash
   cp .env.example .env
   ```

   **Opção B — arquivo de configuração local**, também criado a partir de um template:

   ```bash
   cp config/config.example.json config/config.local.json
   ```

   Em qualquer uma das duas, preencha os valores com os dados do seu ambiente.

### Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `BASE_URL` | URL base da API sob teste | `http://localhost:3000` |
| `USUARIO` | Usuário válido usado para autenticar | `julio.lima` |
| `SENHA` | Senha do usuário válido | `123456` |

A precedência de resolução é sempre `process.env` → `config/config.local.json`. Se a `BASE_URL` não estiver em nenhum dos dois, a suíte falha na inicialização com uma mensagem explicando como configurar.

Nenhum dos dois arquivos é versionado — os templates `.env.example` e `config/config.example.json` existem justamente para documentar quais chaves precisam ser preenchidas.

## 🧪 Execução

Com a API no ar em um terminal, abra **outro** terminal na pasta deste repositório.

Rodar toda a suíte:

```bash
npm test
```

Rodar uma suíte específica:

```bash
npx mocha ./test/login.test.js --timeout=200000
```

Filtrar por nome de teste:

```bash
npx mocha ./test/**/*.test.js --timeout=200000 --grep "401"
```

## ⚠️ Falhas esperadas

Nem toda falha desta suíte é problema de configuração. Alguns testes existem justamente para evidenciar divergências entre o que o contrato OpenAPI promete e o que a API entrega — quando eles falham, o resultado é um **achado**, não um erro de setup:

| Teste | Divergência |
|-------|-------------|
| Campos de paginação `page`, `limit` e `total` | O serviço de contas ignora os parâmetros de paginação e devolve apenas `{ contas }`, sem os campos documentados |
| Campo `ativa` como string | O campo é `BOOLEAN` no banco e chega como `0`/`1`, não como a string prevista no contrato |
| `saldo` como número | O campo é `DECIMAL` e o driver MySQL entrega valores decimais como string por padrão |

Esses três casos nasceram da aplicação de VADER (letra **R**, respostas) e POISED (letra **I**, interoperabilidade). Mantê-los vermelhos é intencional: eles documentam a lacuna. Se um dia a API for corrigida, eles ficam verdes sozinhos.

## 📊 Relatórios

O reporter Mochawesome gera automaticamente `mochawesome-report/mochawesome.html` a cada execução, com resumo geral, status de cada teste, tempo de execução e stack trace das falhas. A pasta não é versionada.

## 🧭 Heurísticas de teste aplicadas

Os cenários deste repositório não foram escritos por intuição: partiram da análise do contrato OpenAPI (`banco-swagger.json`) guiada por duas heurísticas de teste exploratório de API, **VADER** e **POISED**. Elas funcionam como um roteiro de perguntas — cada letra é um ângulo de ataque que a gente se obriga a considerar em cada endpoint, o que reduz a chance de a suíte ficar só no caminho feliz.

### VADER

| Letra | Dimensão | Como aparece na suíte |
|-------|----------|------------------------|
| **V** | Verbo HTTP | Verbos não documentados nos endpoints de login e de contas, esperando 405 |
| **A** | Autenticação e autorização | Requisições sem o header `Authorization`, token inválido e esquema `Beares` em vez de `Bearer` |
| **D** | Dados | Campos obrigatórios ausentes ou vazios (`username`, `senha`, `contaOrigem`), id não numérico e valor de transferência no limite de R$10,00 |
| **E** | Erros e exceções | JSON malformado no corpo da requisição, ids inexistentes (404) e violação de regra de negócio (422) |
| **R** | Respostas | Tipos e valores do corpo da resposta, campos de paginação `page`/`limit`/`total` e quantidade de elementos retornados |

### POISED

| Letra | Dimensão | Como aparece na suíte |
|-------|----------|------------------------|
| **P** | Parameter (Parâmetros) | Parâmetros de query (`page`, `limit`) e de path (id válido, inexistente e não numérico) |
| **O** | Output (Saída) | Asserções sobre status, estrutura e tipos do corpo — `token` como string, `saldo` como número, `id` como número |
| **I** | Interoperability (Interoperabilidade) | Confronto entre o contrato documentado e o comportamento real da API, como o campo `ativa` e os códigos de status previstos no Swagger |
| **S** | Security (Segurança) | Controle de acesso em todos os endpoints protegidos e mensagem de erro idêntica para usuário inexistente e senha incorreta, evitando enumeração de usuários |
| **E** | Error (Erros) | Comportamento da API diante de entradas inválidas e malformadas, validando o contrato de erro |
| **D** | Data (Dados) | Massa de teste em fixtures, valores de borda e combinações inválidas, como conta de origem igual à de destino |

As duas heurísticas se sobrepõem de propósito: VADER organiza a varredura por endpoint e POISED puxa o olhar para parâmetros, contrato e segurança. Aplicadas juntas, foram elas que originaram os testes de 405, de anti-enumeração de usuários e de validação de contrato listados abaixo.

## 🔐 Cenários cobertos

### Login — `POST /login` e `GET /login`

| Cenário | Esperado |
|---------|----------|
| Credenciais válidas retornam token em string | 200 |
| Usuário não informado | 400 + mensagem de campos obrigatórios |
| Senha não informada | 400 + mensagem de campos obrigatórios |
| Usuário incorreto ou inválido | 401 |
| Senha incorreta ou inválida | 401 |
| Corpo da requisição com JSON malformado | 400 + erro em string |
| Mesma mensagem para usuário inexistente e senha incorreta (anti-enumeração de usuários) | 401 com mensagens idênticas |
| Verbo não documentado no endpoint de login | 405 |

### Contas — `GET /contas` e `GET /contas/{id}`

| Cenário | Esperado |
|---------|----------|
| Listagem das contas cadastradas | 200 |
| Consulta por id válido, validando tipos dos campos e saldo | 200 |
| Listagem sem o header `Authorization` | 401 |
| Detalhe da conta sem o header `Authorization` | 401 |
| Token inválido | 401 |
| Esquema `Beares` em vez de `Bearer` | 401 |
| Verbo não documentado no endpoint de contas | 405 |
| Id de conta inexistente | 404 |
| Id de conta não numérico | 400 |
| Campos de paginação `page`, `limit` e `total` no corpo da resposta | Conforme contrato |
| Campo `ativa` retornado como string, conforme documentado | Conforme contrato |

### Transferências — `POST /transferencias`, `GET /transferencias` e `GET /transferencias/{id}`

| Cenário | Esperado |
|---------|----------|
| Valor acima de R$10,00 | 201 |
| Valor abaixo de R$10,00 | 422 |
| Transferência sem o header `Authorization` | 401 |
| Campo obrigatório `contaOrigem` ausente | 400 |
| Conta de origem igual à conta de destino | 422 |
| Consulta por id válido, validando os dados do registro | 200 |
| Id de transferência inexistente | 404 |
| Esquema `Beares` em vez de `Bearer` | 401 |
| Paginação retornando 10 elementos | 200 + `limit` igual a 10 |
| Listagem sem o header `Authorization` | 401 |

## 🔧 Uso do helper de autenticação

Sem argumentos, o helper usa a credencial configurada no ambiente:

```javascript
const { obterToken } = require('../helpers/autenticacao');

const token = await obterToken();
```

Os parâmetros continuam disponíveis para quando um teste precisar de **outro** usuário — por exemplo, para validar permissões:

```javascript
const token = await obterToken('maria.silva', 'senha123');
```

Nas suítes, ele é chamado no `beforeEach` para garantir um token válido a cada teste:

```javascript
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');

let token;

beforeEach(async () => {
    token = await obterToken();
});

const resposta = await api
    .get('/contas?page=1&limit=10')
    .set('Authorization', `Bearer ${token}`);
```

## 🗺️ Próximos passos

Backlog de evolução identificado no estado atual do projeto:

- [ ] Cobrir os endpoints `PUT`, `PATCH` e `DELETE /transferencias/{id}`, documentados no Swagger e ainda sem testes
- [ ] Reduzir a dependência de dados fixos do banco (ids e saldos hardcoded) criando massa de teste na própria suíte
- [ ] Executar a suíte em pipeline de CI (GitHub Actions), publicando o relatório Mochawesome

## 🤝 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NomeDaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: descrição da mudança'`)
4. Push para a branch (`git push origin feature/NomeDaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## ✉️ Contato

**Autora**: Pamela T. F.
**GitHub**: [@pamelatf](https://github.com/pamelatf)

---

**Versão**: 2.0.0
**Última atualização**: 2026-07-27