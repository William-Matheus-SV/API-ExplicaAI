/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const cors = require('cors');
//const authRoutes = require('./routes/authRoutes');
//const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

// Middlewares Globais vitais para o projeto
app.use(cors()); // Permite que o React (Front-end) acesse essa API
app.use(express.json()); // Habilita o Express a ler corpos de requisições em formato JSON

// Vinculando as rotas aos caminhos da API
//app.use('/api/auth', authRoutes);
//app.use('/api', usuarioRoutes);

// Rota de teste inicial para verificar se a API está online
app.get('/api/teste', (req, res) => {
    res.json({ mensagem: "API do ExplicaAí funcionando e aguardando conexões! 🚀" });
});

// Configuração da porta
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando liso na porta ${PORT}`);
});