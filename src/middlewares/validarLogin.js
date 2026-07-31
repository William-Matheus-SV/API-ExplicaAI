//Um middleware que verifica se o Matrícula enviado no corpo da requisição é válido e se a senha não veio vazia.

const validarLogin = (req, res, next) => {
    const { matricula, senha } = req.body;

    if(!matricula || !senha) {
        return res.status(400).json({ message: "Matrícula e senha são obrigatórios" });
    }

    const matriculaRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!matriculaRegex.test(matricula)) {
        return res.status(400).json({ message: "Matrícula inválido" });
    }
    
    next(); // Se tudo estiver certo, passa para o próximo middleware ou rota
};

module.exports = validarLogin;