require('dotenv').config();
const mongoose = require("mongoose");

const conectarBanco = async () => {
    if (!process.env.MONGO_URI) {
        console.error("Erro: variável MONGO_URI não encontrada no ambiente.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Banco conectado com sucesso!");
    } catch (erro) {
        console.error("Erro ao conectar no MongoDB");
        console.error(erro.message);
        process.exit(1);
    }
};

module.exports = conectarBanco;