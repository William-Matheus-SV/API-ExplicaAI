const request = require("supertest");
const app = require("../src/app");

const loginAluno = async () => {
    const resposta = await request(app)
        .post("/api/auth/login/aluno")
        .send({
            matricula: process.env.TEST_ALUNO_MATRICULA,
            senha: process.env.TEST_ALUNO_SENHA
        });

    if (resposta.statusCode !== 200) {
        throw new Error(
            `Erro no login do aluno: ${JSON.stringify(resposta.body)}`
        );
    }

    return resposta.body.token;
};

const loginTutor = async () => {
    const resposta = await request(app)
        .post("/api/auth/login/tutor")
        .send({
            matricula: process.env.TEST_TUTOR_MATRICULA,
            senha: process.env.TEST_TUTOR_SENHA
        });

    if (resposta.statusCode !== 200) {
        throw new Error(
            `Erro no login do tutor: ${JSON.stringify(resposta.body)}`
        );
    }

    return resposta.body.token;
};

module.exports = {
    loginAluno,
    loginTutor
};