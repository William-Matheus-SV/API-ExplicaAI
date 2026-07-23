const Usuario = require("../models/Usuario");

const cadastrarUsuario = async (req, res) => {

    try {

        const {
            nome,
            matricula,
            idade,
            materias,
            bio,
            email,
            senha
        } = req.body;

        const novoUsuario = new Usuario({
            nome,
            matricula,
            idade,
            materias,
            bio,
            email,
            senha
        });

        await novoUsuario.save();

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: novoUsuario
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

};

module.exports = {
    cadastrarUsuario
};