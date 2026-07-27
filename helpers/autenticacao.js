const { api } = require('../config/ambiente');

const obterToken = async (usuario, senha) => {
    const respostaLogin = await api
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
            username: usuario,
            senha: senha
        });

    return respostaLogin.body.token;
};

module.exports = {
    obterToken
};
