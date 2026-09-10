const Tutor = require("../models/Tutor");

// Cadastrar Tutor
const cadastrarTutor = async (req, res) => {

    try {

        const {
            nome,
            idade,
            matricula,
            senha,
            bio,
            materiasLecionadas,
            agendaDisponivel
        } = req.body;

        const novoTutor = new Tutor({
            nome,
            idade,
            matricula,
            senha,
            bio,
            materiasLecionadas,
            agendaDisponivel
        });

        await novoTutor.save();

        res.status(201).json({
            mensagem: "Tutor cadastrado com sucesso!",
            tutor: novoTutor
        });

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro ao cadastrar tutor.",
            erro: erro.message
        });

    }

};

// Listar todos os tutores
const listarTutores = async (req, res) => {

    try {

        const tutores = await Tutor.find();

        res.status(200).json(tutores);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro ao listar tutores.",
            erro: erro.message
        });

    }

};

// Buscar tutor pela matrícula
const buscarTutor = async (req, res) => {

    try {

        const tutor = await Tutor.findOne({
            matricula: req.params.matricula
        });

        if (!tutor) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        res.status(200).json(tutor);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro ao buscar tutor.",
            erro: erro.message
        });

    }

};
// Atualizar tutor adicionada
const atualizarTutor = async (req, res) => {
    try {

        const { matricula } = req.params;
        const { materiasLecionadas, bio, idade } = req.body;

        const tutor = await Tutor.findOne({ matricula });

        if (!tutor) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        if (materiasLecionadas !== undefined) {
            tutor.materiasLecionadas = materiasLecionadas;
        }

        if (bio !== undefined) {
            tutor.bio = bio;
        }

        if (idade !== undefined) {
            tutor.idade = idade;
        }

        await tutor.save();

        res.status(200).json({
            mensagem: "Perfil do tutor atualizado com sucesso!",
            tutor
        });

    } catch (erro) {

        if (erro.name === "ValidationError") {
            return res.status(400).json({
                mensagem: erro.message
            });
        }

        console.error("Erro ao atualizar tutor:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar tutor."
        });
    }
};

module.exports = {
    cadastrarTutor,
    listarTutores,
    buscarTutor,
    atualizarTutor
};

// adicionei o "tutorController.js" na main!