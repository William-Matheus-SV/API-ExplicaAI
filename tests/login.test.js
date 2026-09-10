const request = require("supertest");
const app = require("../src/app");

describe("Testes de Login", () => {

    test("Aluno deve conseguir fazer login", async () => {

        const resposta = await request(app)
            .post("/api/auth/login/aluno")
            .send({
                matricula: process.env.TEST_ALUNO_MATRICULA,
                senha: process.env.TEST_ALUNO_SENHA
            });

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body.token).toBeDefined();

    });

    test("Tutor deve conseguir fazer login", async () => {

        const resposta = await request(app)
            .post("/api/auth/login/tutor")
            .send({
                matricula: process.env.TEST_TUTOR_MATRICULA,
                senha: process.env.TEST_TUTOR_SENHA
            });

        expect(resposta.statusCode).toBe(200);
        expect(resposta.body.token).toBeDefined();

    });

});