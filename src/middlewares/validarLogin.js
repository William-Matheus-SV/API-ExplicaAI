//Um middleware que verifica se o e-mail enviado no corpo da requisição é válido e se a senha não veio vazia.

const validarLogin = (req, res, next) => {
    const { email, senha } = req.body;

    if(!email || !senha) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({ message: "E-mail inválido" });
    }
    
    next(); // Se tudo estiver certo, passa para o próximo middleware ou rota
};

module.exports = validarLogin;