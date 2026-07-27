const { expect } = require('chai');
const { api, credenciais } = require('../config/ambiente');
const postLogin = require('../fixtures/postLogin.json');

const montarBodyLogin = () => ({
    ...postLogin,
    username: credenciais.usuario,
    senha: credenciais.senha
});

describe('Login', () => {

    describe('POST /login', () => {

        it('Deve retornar 200 com token em string quando usar credenciais válidas', async () => {
            const bodyLogin = montarBodyLogin();

            const resposta = await api
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.token).to.be.a('string');
        });

        it('Deve retornar 400 quando o usuário não for informado', async () => {
            const bodyLogin = montarBodyLogin();
            bodyLogin.username = '';

            const resposta = await api
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário e senha são obrigatórios.');
        });

        it('Deve retornar 400 quando a senha não for informada', async () => {
            const bodyLogin = montarBodyLogin();
            bodyLogin.senha = '';

            const resposta = await api
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário e senha são obrigatórios.');
        });

        it('Deve retornar 401 quando for informado um usuário incorreto ou inválido', async () => {
            const bodyLogin = montarBodyLogin();
            bodyLogin.username = 'junior';

            const resposta = await api
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Usuário ou senha inválidos.');
        });

        it('Deve retornar 401 quando for informada uma senha incorreta ou inválida', async () => {
            const bodyLogin = montarBodyLogin();
            bodyLogin.senha = '12345';

            const resposta = await api
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Usuário ou senha inválidos.');
        });

        it('Deve retornar 400 com uma mensagem de erro quando o corpo da requisição for um JSON malformado', async () => {
            const resposta = await api
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(`{"username":"${credenciais.usuario}","senha":`);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.be.a('string');
        });

        it('Deve retornar a mesma mensagem de erro para usuário inexistente e para senha incorreta, evitando enumeração de usuários', async () => {
            const bodyUsuarioInexistente = montarBodyLogin();
            bodyUsuarioInexistente.username = 'usuario.inexistente';

            const bodySenhaIncorreta = montarBodyLogin();
            bodySenhaIncorreta.senha = 'senhaErrada123';

            const respostaUsuarioInexistente = await api
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodyUsuarioInexistente);

            const respostaSenhaIncorreta = await api
                .post('/login')
                .set('Content-Type', 'application/json')
                .send(bodySenhaIncorreta);

            expect(respostaUsuarioInexistente.status).to.equal(401);
            expect(respostaSenhaIncorreta.status).to.equal(401);
            expect(respostaUsuarioInexistente.body.error).to.equal(respostaSenhaIncorreta.body.error);
        });

    });

    describe('GET /login', () => {

        it('Deve retornar 405 quando um verbo não documentado for utilizado no endpoint de login', async () => {
            const resposta = await api
                .get('/login');

            expect(resposta.status).to.equal(405);
        });

    });

});