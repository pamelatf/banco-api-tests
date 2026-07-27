const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');

describe('GET/contas', () => {

    let token;

    beforeEach(async () => {
        token = await obterToken('julio.lima', '123456');
    });

    it('Deve retornar as contas cadastradas', async () => {
        const resposta = await api
            .get('/contas?page=1&limit=10')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(200);
        expect(resposta.body.contas).to.have.lengthOf(2);
    });

    it('Deve retornar sucesso com 200 e dados iguais ao registro de contas contido no banco de dados quando o id for válido', async () => {
        const resposta = await api
            .get('/contas/1')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(200);
        expect(resposta.body.id).to.equal(1);
        expect(resposta.body.id).to.be.a('number');
        expect(resposta.body.titular).to.be.a('string');
        expect(resposta.body.saldo).to.be.a('number');
        expect(resposta.body.saldo).to.equal(6171.13);
    });

    it('Deve retornar 401 quando a listagem de contas for consultada sem o header Authorization', async () => {
        const resposta = await api
            .get('/contas?page=1&limit=10');

        expect(resposta.status).to.equal(401);
    });

    it('Deve retornar 401 quando os detalhes de uma conta forem consultados sem o header Authorization', async () => {
        const resposta = await api
            .get('/contas/1');

        expect(resposta.status).to.equal(401);
    });

    it('Deve retornar 401 quando o token enviado for inválido', async () => {
        const resposta = await api
            .get('/contas')
            .set('Authorization', 'Bearer token.invalido.aqui');

        expect(resposta.status).to.equal(401);
    });

    it('Deve retornar 401 quando o esquema do Authorization for "Beares" em vez de "Bearer"', async () => {
        const resposta = await api
            .get('/contas')
            .set('Authorization', `Beares ${token}`);

        expect(resposta.status).to.equal(401);
    });

    it('Deve retornar 405 quando um verbo não documentado for utilizado no endpoint de contas', async () => {
        const resposta = await api
            .post('/contas')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(405);
    });

    it('Deve retornar 404 quando o id da conta consultada não existir', async () => {
        const resposta = await api
            .get('/contas/999999')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(404);
    });

    it('Deve retornar 400 quando o id da conta consultada não for numérico', async () => {
        const resposta = await api
            .get('/contas/abc')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(400);
    });

    it('Deve retornar os campos de paginação page, limit e total documentados no corpo da resposta', async () => {
        const resposta = await api
            .get('/contas?page=1&limit=10')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.body.page).to.equal(1);
        expect(resposta.body.limit).to.equal(10);
        expect(resposta.body.total).to.be.a('number');
    });

    it('Deve retornar o campo "ativa" como string, conforme documentado no contrato da API', async () => {
        const resposta = await api
            .get('/contas?page=1&limit=10')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.body.contas[0].ativa).to.be.a('string');
    });

});