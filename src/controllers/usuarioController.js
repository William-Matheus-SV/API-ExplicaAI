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
// Atualizar aluno adicionada
const atualizarUsuario = async (req, res) => {
    try {

        const { matricula } = req.params;
        const { materias, bio, idade } = req.body;

        const usuario = await Usuario.findOne({ matricula });

        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        if (materias !== undefined) {
            usuario.materias = materias;
        }

        if (bio !== undefined) {
            usuario.bio = bio;
        }

        if (idade !== undefined) {
            usuario.idade = idade;
        }

        await usuario.save();

        res.status(200).json({
            mensagem: "Perfil atualizado com sucesso!",
            usuario
        });

    } catch (erro) {

        if (erro.name === "ValidationError") {
            return res.status(400).json({
                mensagem: erro.message
            });
        }

        console.error("Erro ao atualizar usuário:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar usuário."
        });
    }
};

module.exports = {
    cadastrarUsuario,
    buscarUsuario,
    atualizarUsuario
};