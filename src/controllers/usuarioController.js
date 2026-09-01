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
    const buscarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ matricula: req.params.matricula });

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        res.status(200).json(usuario);

    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao buscar usuário.",
            erro: erro.message
        });
    }
};

module.exports = {
    cadastrarUsuario,
    buscarUsuario
};