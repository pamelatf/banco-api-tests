const { expect } = require('chai');
const { api } = require('../config/ambiente');
const { obterToken } = require('../helpers/autenticacao');
const postTransferencias = require('../fixtures/postTransferencias.json');

describe('Transferências', () => {

    let token;

    beforeEach(async () => {
        token = await obterToken('julio.lima', '123456');
    });

    describe('POST /transferencias', () => {

        it('Deve retornar sucesso com 201 quando o valor da transferência for acima de R$10,00', async () => {
            const bodyTransferencias = {
                ...postTransferencias
            };

            const resposta = await api
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias);

            expect(resposta.status).to.equal(201);
        });

        it('Deve retornar falha com 422 quando o valor da transferência for abaixo de R$10,00', async () => {
            const bodyTransferencias = {
                ...postTransferencias
            };

            bodyTransferencias.valor = 7;

            const resposta = await api
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias);

            expect(resposta.status).to.equal(422);
        });

        it('Deve retornar 401 quando a transferência for solicitada sem o header Authorization', async () => {
            const bodyTransferencias = {
                ...postTransferencias
            };

            const resposta = await api
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .send(bodyTransferencias);

            expect(resposta.status).to.equal(401);
        });

        it('Deve retornar 400 quando o campo obrigatório contaOrigem não for informado', async () => {
            const bodyTransferencias = {
                ...postTransferencias
            };

            delete bodyTransferencias.contaOrigem;

            const resposta = await api
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias);

            expect(resposta.status).to.equal(400);
        });

        it('Deve rejeitar uma transferência em que a conta de origem e a conta de destino são a mesma conta', async () => {
            const bodyTransferencias = {
                ...postTransferencias
            };

            bodyTransferencias.contaDestino = bodyTransferencias.contaOrigem;

            const resposta = await api
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias);

            expect(resposta.status).to.equal(422);
        });

    });

    describe('GET /transferencias/{id}', () => {

        it('Deve retornar sucesso com 200 e dados iguais ao registro de transferência contido no banco de dados quando o id for válido', async () => {
            const resposta = await api
                .get('/transferencias/1')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.id).to.equal(1);
            expect(resposta.body.id).to.be.a('number');
            expect(resposta.body.conta_origem_id).to.equal(1);
            expect(resposta.body.conta_destino_id).to.equal(2);
            expect(resposta.body.valor).to.equal(8564.86);
        });

        it('Deve retornar 404 quando o id da transferência consultada não existir', async () => {
            const resposta = await api
                .get('/transferencias/999999')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(404);
        });

        it('Deve retornar 401 quando o esquema do header Authorization for "Beares" em vez de "Bearer"', async () => {
            const resposta = await api
                .get('/transferencias/2')
                .set('Authorization', `Beares ${token}`);

            expect(resposta.status).to.equal(401);
        });

    });

    describe('GET /transferencias', () => {

        it('Deve retornar 10 elementos na paginação', async () => {
            const resposta = await api
                .get('/transferencias?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.limit).to.equal(10);
            expect(resposta.body.transferencias).to.have.lengthOf(10);
        });

        it('Deve retornar 401 quando a listagem de transferências for consultada sem o header Authorization', async () => {
            const resposta = await api
                .get('/transferencias?page=1&limit=10');

            expect(resposta.status).to.equal(401);
        });

    });

});