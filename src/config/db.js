// add banco local
const mongoose = require("mongoose");

const conectarBanco = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/");

        console.log(" Banco conectado com sucesso!");
    } catch (erro) {
        console.error(" Erro ao conectar no MongoDB");
        console.error(erro.message);
        process.exit(1);
    }
};

module.exports = conectarBanco;