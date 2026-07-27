# Banco API Tests 🏦

Testes automatizados de API para a **API de Transferências Bancárias** (v2.0.0), escritos em **Node.js** com **Mocha + Chai + Supertest**.

O projeto vai além do caminho feliz: cobre validação de contrato, regras de negócio, autenticação/autorização e cenários de segurança derivados da análise do Swagger (`banco-swagger.json`).

## 📋 Sobre o projeto

A API sob teste permite login com autenticação JWT, consulta de contas e criação/consulta de transferências. Os testes deste repositório validam esses fluxos comparando o comportamento real da API com o que está documentado no contrato OpenAPI incluído na raiz do projeto.

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
│   ├── postLogin.json          # Payload base de login
│   └── postTransferencias.json # Payload base de transferência
├── helpers/
│   └── autenticacao.js         # obterToken() — geração de token reutilizável
├── test/
│   ├── login.test.js           # POST /login e verbo não documentado
│   ├── conta.test.js           # GET /contas e GET /contas/{id}
│   └── transferencia.test.js   # POST/GET /transferencias e GET /transferencias/{id}
├── banco-swagger.json          # Contrato OpenAPI da API sob teste
├── package.json
└── .gitignore
```

## ✅ Boas práticas aplicadas

Estas são as decisões de organização adotadas no projeto — elas explicam por que os arquivos estão distribuídos dessa forma:

- **Configuração centralizada** (`config/ambiente.js`): a `baseURL` é resolvida em um único lugar e exportada como uma instância pronta do Supertest (`api`), consumida por todas as suítes e também pelo helper de autenticação. Nenhum teste conhece a URL da API — trocar de ambiente não exige tocar em arquivo de teste.
- **Configuração flexível e à prova de clone limpo**: `.env` e `config.local.json` são intercambiáveis, o caminho do arquivo local é resolvido a partir de `__dirname` (a suíte roda de qualquer diretório) e a ausência de configuração produz uma mensagem de erro acionável, não um `ENOENT`.
- **Segredos e configuração local fora do versionamento**: `.env` e `config/config.local.json` estão no `.gitignore`. O repositório versiona apenas o `config.example.json`, que serve de template.
- **Fixtures externas** (`fixtures/`): os payloads ficam em JSON, separados da lógica de teste.
- **Fixtures imutáveis**: cada teste trabalha sobre uma cópia (`{ ...postLogin }`) em vez de alterar o objeto importado, evitando vazamento de estado entre testes.
- **Helper de autenticação** (`helpers/autenticacao.js`): o login é encapsulado em `obterToken()` e chamado no `beforeEach`, eliminando duplicação de setup nas suítes.
- **Testes organizados por endpoint**: `describe` aninhado por recurso e método HTTP, o que deixa o relatório legível.
- **Nomes de teste descritivos**: cada `it` declara o comportamento esperado, o código de status e a condição — o nome já documenta o cenário.
- **Cobertura além do caminho feliz**: cenários negativos, de contrato e de segurança (ver abaixo).
- **Relatório fora do Git**: `mochawesome-report/` é ignorado.

## 📦 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm
- A API bancária rodando localmente (por padrão em `http://localhost:3000`)

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

3. Configure a URL da API. Basta **uma** das duas opções abaixo:

   **Opção A — arquivo `.env` na raiz** (recomendada para CI):

   ```
   BASE_URL=http://localhost:3000
   ```

   **Opção B — arquivo de configuração local**, criado a partir do template versionado:

   ```bash
   cp config/config.example.json config/config.local.json
   ```

### Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `BASE_URL` | URL base da API sob teste | `http://localhost:3000` |

A precedência de resolução é: `process.env.BASE_URL` → `config/config.local.json`. Se nenhuma das duas estiver disponível, a suíte falha na inicialização com uma mensagem explicando como configurar.

## 🧪 Execução

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

## 📊 Relatórios

O reporter Mochawesome gera automaticamente `mochawesome-report/mochawesome.html` a cada execução, com resumo geral, status de cada teste, tempo de execução e stack trace das falhas. A pasta não é versionada.

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

```javascript
const { obterToken } = require('../helpers/autenticacao');

const token = await obterToken('julio.lima', '123456');
```

Nas suítes, ele é chamado no `beforeEach` para garantir um token válido a cada teste:

```javascript
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');

let token;

beforeEach(async () => {
    token = await obterToken('julio.lima', '123456');
});

const resposta = await api
    .get('/contas?page=1&limit=10')
    .set('Authorization', `Bearer ${token}`);
```

## 🗺️ Próximos passos

Backlog de evolução identificado no estado atual do projeto:

- [ ] Mover as credenciais de teste para variáveis de ambiente, em vez de literais nas suítes
- [ ] Cobrir os endpoints `PUT`, `PATCH` e `DELETE /transferencias/{id}`, documentados no Swagger e ainda sem testes
- [ ] Reduzir a dependência de dados fixos do banco (ids e saldos hardcoded) criando massa de teste na própria suíte
- [ ] Remover os `console.log` remanescentes de `test/conta.test.js`
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