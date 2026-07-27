const request = require('supertest');
const { expect } = require ('chai')
require ('dotenv').config()
const postLogin = require ('../fixtures/postLogin.json')

describe('Login', () => {
    describe('POST /login', () => {
        it('Deve retornar 200 com token em string quando usar credenciais válidas', async () => {
           const bodyLogin = {...postLogin} 

            const resposta = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin)
            expect(resposta.status).to.equal(200);
            expect(resposta.body.token).to.be.a('string');
        })

        it('Deve retornar 400 quando o usuário não for informado', async () => {
            const bodyLogin = {...postLogin}
            bodyLogin.username = ''

            const resposta = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin)
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário e senha são obrigatórios.')
        })

        it('Deve retornar 400 quando a senha não for informada', async () => {
            const bodyLogin = {...postLogin}
            bodyLogin.senha = ''

            const resposta = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin)
            
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Usuário e senha são obrigatórios.')
        })

        it('Deve retornar 401 quando for informado um usuário incorreto ou invàlido', async () => {
            const bodyLogin = {...postLogin}
            bodyLogin.username = 'junior'
            bodyLogin.senha = '123456'

            const resposta = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin)
            
            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Usuário ou senha inválidos.')
        })

        it('Deve retornar 401 quando for informada uma senha incorreta ou invàlida', async () => {
            const bodyLogin = {...postLogin}
            bodyLogin.username ='julio.lima'
            bodyLogin.senha = '12345'

            const resposta = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(bodyLogin)

            console.log(resposta.body)
            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Usuário ou senha inválidos.')
        })

        it('Deve retornar 400 com uma mensagem de erro quando o corpo da requisição for um JSON malformado', async () => {
            const resposta = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send('{"username":"julio.lima","senha":')

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.be.a('string');
        })

        it('Deve retornar a mesma mensagem de erro para usuário inexistente e para senha incorreta, evitando enumeração de usuários', async () => {
            const bodyUsuarioInexistente = {...postLogin}
            bodyUsuarioInexistente.username = 'usuario.inexistente'

            const bodySenhaIncorreta = {...postLogin}
            bodySenhaIncorreta.senha = 'senhaErrada123'

            const respostaUsuarioInexistente = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(bodyUsuarioInexistente)

            const respostaSenhaIncorreta = await request(process.env.BASE_URL)
            .post('/login')
            .set('Content-Type', 'application/json')
            .send(bodySenhaIncorreta)

            expect(respostaUsuarioInexistente.status).to.equal(401);
            expect(respostaSenhaIncorreta.status).to.equal(401);
            expect(respostaUsuarioInexistente.body.error).to.equal(respostaSenhaIncorreta.body.error)
        })
} )

    describe('GET /login', () => {
        it('Deve retornar 405 quando um verbo não documentado for utilizado no endpoint de login', async () => {
            const resposta = await request(process.env.BASE_URL)
            .get('/login')

            expect(resposta.status).to.equal(405);
        })
    })
})