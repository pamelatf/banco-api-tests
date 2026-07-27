const fs = require('fs');
const request = require('supertest');

require('dotenv').config();

const configLocal = JSON.parse(
    fs.readFileSync('./config/config.local.json', 'utf-8')
);

function pegarBaseURL() {
    return process.env.BASE_URL || configLocal.baseUrl;
}

const api = request(pegarBaseURL());

module.exports = {
    api
};