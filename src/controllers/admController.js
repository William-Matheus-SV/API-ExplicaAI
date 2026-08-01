const adm = require("../models/Adm");

const loginAdm = (req, res) => {
    const { email, senha } = req.body;

    if (email === adm.email && senha === adm.senha) {
        return res.status(200).json({
            mensagem: "Login de administrador realizado com sucesso!",
            administrador: {
                nome: adm.nome,
                email: adm.email
            }
        });
    }

    return res.status(401).json({
        mensagem: "Email ou senha do administrador incorretos."
    });
};

const visualizarAdm = (req, res) => {
    res.status(200).json({
        nome: adm.nome,
        email: adm.email
    });
};

module.exports = {
    loginAdm,
    visualizarAdm
};