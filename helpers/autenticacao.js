const { api, credenciais } = require('../config/ambiente');

const obterToken = async (
    usuario = credenciais.usuario,
    senha = credenciais.senha
) => {
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
