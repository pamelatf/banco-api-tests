const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao');

describe('Transferências', () => {
    describe('POST /transferencias', () => {
        it('Deve retornar sucesso com 201 quando o valor da transferência for acima de R$10,00', async () => {
            // Capturar o token
            const token = await obterToken('julio.lima', '123456')
            
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 2,
                    contaDestino: 1,
                    valor: 20.00,
                    token: ''
                });
            console.log('Status da transferência:', resposta.status);
            console.log('Resposta:', resposta.body);    
        });

        it('Deve retornar falha com 422 quando o valor da transferência for abaixo de R$10,00', async () => {
            // Capturar o token
            const token = await obterToken('julio.lima', '123456')

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 2,
                    contaDestino: 1,
                    valor: 9.99,
                    token: ''
                });
            console.log('Status da transferência:', resposta.status);
            console.log('Resposta:', resposta.body);                  
        });
    });
});