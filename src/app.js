require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importando as rotas
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const matchRoutes = require("./routes/matchRoutes");
const agendaRoutes = require("./routes/agendaRoutes");
const admRoutes = require("./routes/admRoutes");

// Vinculando as rotas
app.use("/api/auth", authRoutes);
app.use("/api", usuarioRoutes);
app.use("/api", tutorRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api", admRoutes);

// Rota de teste
app.get("/api/teste", (req, res) => {
    res.json({
        mensagem: "API do ExplicaAí funcionando e aguardando conexões!"
    });
});

module.exports = app;