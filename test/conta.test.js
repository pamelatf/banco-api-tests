const request = require('supertest');
const { expect } = require ('chai')
require ('dotenv').config()
const { obterToken } = require('../helpers/autenticacao');
const postLogin = require ('../fixtures/postLogin.json')

describe('GET/contas', () => {
        let token 

        beforeEach (async () => {
            token = await obterToken('julio.lima', '123456')
        })

        it('Deve retornar 10 elementos na paginação de contas', async() => {
            const resposta = await request(process.env.BASE_URL)
                .get('/contas?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`)

            console.log(resposta.body)
            expect(resposta.status).to.equal(200)
            expect(resposta.body.contas).to.have.lengthOf(2)
        })

        it('Deve retornar sucesso com 200 e dados iguais ao registro de contas contido no banco de dados quando o id for válido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/contas/1')
                .set('Authorization', `Beares ${token}`)

            console.log(resposta.saldo)
            expect(resposta.status).to.equal(200)
            expect(resposta.body.id).to.equal(1)
            expect(resposta.body.id).to.be.a('number')
            expect(resposta.body.titular).to.be.a('string')         
            expect(resposta.body.saldo).to.be.a('number')
            expect(resposta.body.saldo).to.equal(6171.13)              
        });
})
