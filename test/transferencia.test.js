const request = require('supertest');
const { expect } = require ('chai')
require ('dotenv').config()

describe('Transferências', () => {
    describe('POST /transferencias', () => {
        it('Deve retornar sucesso com 201 quando o valor da transferência for acima de R$10,00', async () => {
            //Capturar o token
            const respostaLogin = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send( {
                "username": "julio.lima",
                "senha": "123456"
}) 
            const token = respostaLogin.body.token           
            
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 2,
                    contaDestino: 1,
                    valor: 20.00,
                    token: ""
})
            expect(resposta.status).to.equal(201);
            console.log(resposta.body)
        })
        it('Deve retornar falha com 422 quando o valor da transferência for abaixo de R$10,00', async () => {
            //Capturar o token
            const respostaLogin = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send( {
                "username": "julio.lima",
                "senha": "123456"
}) 
            const token = respostaLogin.body.token           
            
            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 2,
                    contaDestino: 1,
                    valor: 9.99,
                    token: ""
})
            expect(resposta.status).to.equal(422);
            console.log(resposta.body)
        })        
})
})