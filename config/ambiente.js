const fs = require('fs');
const path = require('path');
const request = require('supertest');

require('dotenv').config();

const caminhoConfigLocal = path.join(__dirname, 'config.local.json');

function lerConfigLocal() {
    if (!fs.existsSync(caminhoConfigLocal)) {
        return {};
    }

    return JSON.parse(fs.readFileSync(caminhoConfigLocal, 'utf-8'));
}

const configLocal = lerConfigLocal();

function pegarBaseURL() {
    const baseURL = process.env.BASE_URL || configLocal.baseUrl;

    if (!baseURL) {
        throw new Error(
            'BaseURL não configurada. Defina BASE_URL no arquivo .env ou copie config/config.example.json para config/config.local.json.'
        );
    }

    return baseURL;
}

const credenciais = {
    usuario: process.env.USUARIO || configLocal.usuario,
    senha: process.env.SENHA || configLocal.senha
};

const api = request(pegarBaseURL());

module.exports = {
    api,
    pegarBaseURL,
    credenciais
};
