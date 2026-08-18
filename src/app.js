require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();

// Middlewares Globais vitais para o projeto
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
})); // Permite que o React (Front-end) acesse essa API

app.use(express.json()); // Habilita o Express a ler corpos de requisições em formato JSON

app.use(express.urlencoded({extended: true})); //Permite ler dados de formulário

//Conexão com o MongoDB Atlas

//Conexão com MongoDB Local
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/explicaai";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Conectado ao MongoDB com sucesso!"))
    .catch((err) => console.error("Erro ao conectar no MongoDB :", err));

//Importando as rotas de cada branch
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
<<<<<<< HEAD
const matchRoutes = require('./routes/matchRoutes');
const agendaRoutes = require('./routes/agendaRoutes');

=======
//const matchRoutes = require('./routes/matchRoutes'); // Criar depois
const admRoutes = require("./routes/admRoutes"); // adicionei a rota do ADM
>>>>>>> feature/novo-cadastro
// Vinculando as rotas aos caminhos da API
app.use('/api/auth', authRoutes);
app.use('/api', usuarioRoutes);
app.use("/api", tutorRoutes);
<<<<<<< HEAD
app.use("/api/agenda", agendaRoutes);
app.use('/api/matches', matchRoutes);  
=======
//app.use('/api/matches', matchRoutes);  // Matches (se houver)
app.use("/api", admRoutes); // adiicionei aqui a rota API do ADM
>>>>>>> feature/novo-cadastro

// Rota de teste inicial para verificar se a API está online
app.get('/api/teste', (req, res) => {
    res.json({ mensagem: "API do ExplicaAí funcionando e aguardando conexões!" });
});

// Configuração da porta
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando liso na porta ${PORT}`);
});