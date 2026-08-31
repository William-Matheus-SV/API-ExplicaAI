require("dotenv").config();

const app = require("./app");
const conectarBanco = require("./config/db");

const PORT = process.env.PORT || 3000;

conectarBanco().then(() => {

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

});