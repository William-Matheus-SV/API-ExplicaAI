const request = require("supertest");
const app = require("../src/app");

const { loginTutor } = require("./auth.helper");

describe("Testes da Agenda", () => {

    let tokenTutor;

    beforeAll(async () => {
        tokenTutor = await loginTutor();
    });

    test("Tutor deve conseguir criar um horário", async () => {

        const resposta = await request(app)
            .post("/api/agenda")
            .set("Authorization", `Bearer ${tokenTutor}`)
            .send({
                dataHorarioInicio: "2026-09-01T15:00:00.000Z",
                duracao: 1
            });

        expect(resposta.statusCode).toBe(201);
        expect(resposta.body.slot).toBeDefined();

    });

});