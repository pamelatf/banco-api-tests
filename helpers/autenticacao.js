const fs = require('fs');
const path = require('path');
const request = require('supertest');

require('dotenv').config();

const caminhoConfigLocal = path.join(__dirname, 'config.local.json');

function pegarBaseURL() {
    if (process.env.BASE_URL) {
        return process.env.BASE_URL;
    }

    if (fs.existsSync(caminhoConfigLocal)) {
        const configLocal = JSON.parse(fs.readFileSync(caminhoConfigLocal, 'utf-8'));

        if (configLocal.baseUrl) {
            return configLocal.baseUrl;
        }
    }

    throw new Error(
        'BaseURL não configurada. Defina BASE_URL no arquivo .env ou copie config/config.example.json para config/config.local.json.'
    );
}

const api = request(pegarBaseURL());

module.exports = {
    api,
    pegarBaseURL
};