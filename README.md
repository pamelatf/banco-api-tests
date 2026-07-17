# Banco API Tests 🏦

Um projeto de testes automatizados para uma API bancária, desenvolvido com **Node.js** e **Mocha**.

## 📋 Descrição

Este projeto contém testes de automação para validar os endpoints principais de uma API bancária, focando em funcionalidades críticas como autenticação e transferências.

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Mocha** - Framework de testes
- **Chai** - Biblioteca de assertions
- **Supertest** - HTTP assertion library
- **Dotenv** - Gerenciamento de variáveis de ambiente
- **Mochawesome** - Reporter visual para testes

## 📦 Instalação

### Pré-requisitos

- Node.js 14.0 ou superior
- npm

### Passos para Instalar

1. Clone o repositório:
```bash
git clone https://github.com/pamelatf/banco-api-tests.git
cd banco-api-tests
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com:
```
BASE_URL=http://localhost:3000
```

## 🧪 Execução de Testes

### Rodar todos os testes:
```bash
npm test
```

### O que é executado:
- Testes de login (`test/login.test.js`)
- Testes de transferência (`test/transferencia.test.js`)
- Relatório detalhado em HTML gerado pelo Mochawesome

## 📁 Estrutura do Projeto

```
banco-api-tests/
├── test/                          # Arquivos de testes
│   ├── login.test.js             # Testes de autenticação
│   └── transferencia.test.js      # Testes de transferências
├── helpers/                        # Funções utilitárias
│   └── autenticacao.js            # Helpers de autenticação
├── fixtures/                       # Dados de teste
│   ├── postLogin.json            # Payload de login
│   └── postTransferencias.json    # Payload de transferências
├── package.json                   # Dependências e scripts
├── .env                           # Variáveis de ambiente (não versionado)
└── .gitignore                     # Arquivos ignorados pelo Git
```

## 🔐 Testes Disponíveis

### 1. Login
- **Arquivo**: `test/login.test.js`
- **Descrição**: Valida o endpoint POST `/login`
- **Casos de teste**:
  - Deve retornar 200 com token em string quando usar credenciais válidas — [test/login.test.js](test/login.test.js#L8)
  - Deve retornar 400 quando o usuário não for informado — [test/login.test.js](test/login.test.js#L19)
  - Deve retornar 400 quando a senha não for informada — [test/login.test.js](test/login.test.js#L32)
  - Deve retornar 401 quando for informado um usuário incorreto ou inválido — [test/login.test.js](test/login.test.js#L45)
  - Deve retornar 401 quando for informada uma senha incorreta ou inválida — [test/login.test.js](test/login.test.js#L59)

### 2. Transferências
- **Arquivo**: `test/transferencia.test.js`
- **Descrição**: Valida o endpoint POST `/transferencias`
- **Funcionalidade**: Testa transferências entre contas

## 🔧 Helpers de Autenticação

O projeto possui um helper reutilizável para obter tokens:

```javascript
const { obterToken } = require('../helpers/autenticacao');

const token = await obterToken('username', 'senha');
```

## 📊 Relatórios

Após executar os testes, um relatório HTML detalhado é gerado pelo Mochawesome, proporcionando:
- Resumo geral dos testes
- Detalhes de cada teste (passou/falhou)
- Tempo de execução
- Stack trace de erros

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `BASE_URL` | URL base da API | `http://localhost:3000` |

## 🚀 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## ✉️ Contato

**Autora**: Pamela T. F.  
**GitHub**: [@pamelatf](https://github.com/pamelatf)

---

**Versão**: 1.0.0  
**Última atualização**: 2026-07-17
