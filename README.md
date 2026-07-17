# Banco API Tests

Breve descrição dos testes automatizados para a API do banco.

**Testes Disponíveis**

- **login.test.js**: testes de autenticação e login. Arquivo: [test/login.test.js](test/login.test.js#L1).
	- Deve retornar 200 com token em string quando usar credenciais válidas — [test/login.test.js](test/login.test.js#L8)
	- Deve retornar 400 quando o usuário não for informado — [test/login.test.js](test/login.test.js#L19)
	- Deve retornar 400 quando a senha não for informada — [test/login.test.js](test/login.test.js#L32)
	- Deve retornar 401 quando for informado um usuário incorreto ou invàlido — [test/login.test.js](test/login.test.js#L45)
	- Deve retornar 401 quando for informada uma senha incorreta ou invàlida — [test/login.test.js](test/login.test.js#L59)
- **transferencia.test.js**: testes de transferências entre contas. Arquivo: [test/transferencia.test.js](test/transferencia.test.js#L1).

**Como Executar**

- Instalar dependências:

```bash
npm install
```

- Executar todos os testes (usa `mochawesome` como repórter):

```bash
npm test
```

- Executar um teste específico com `mocha`:

```bash
npx mocha test/login.test.js --timeout=200000 --reporter mochawesome
```

**Relatórios**

- Relatório HTML gerado em `mochawesome-report/mochawesome.html` após execução com o reporter `mochawesome`.
