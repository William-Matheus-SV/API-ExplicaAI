require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();

// Middlewares Globais vitais para o projeto
app.use(cors()); // Permite que o React (Front-end) acesse essa API
app.use(express.json()); // Habilita o Express a ler corpos de requisições em formato JSON

//Conexão com o MongoDB Atlas
//const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://williammatheus7765_db_user:tmL1HRIlYqZ4ZooN@explicaai.zkdlvx7.mongodb.net/?appName=ExplicaAi";

//Conexão com MongoDB Local
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/explicaai";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Conectado ao MongoDB Atlas com sucesso!"))
    .catch((err) => console.error("Erro ao conectar no MongoDB Atlas:", err));

//Importando as rotas de cada branch
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');

// Vinculando as rotas aos caminhos da API
app.use('/api/auth', authRoutes);
app.use('/api', usuarioRoutes);

// Rota de teste inicial para verificar se a API está online
app.get('/api/teste', (req, res) => {
    res.json({ mensagem: "API do ExplicaAí funcionando e aguardando conexões!" });
});

// Configuração da porta
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando liso na porta ${PORT}`);
});