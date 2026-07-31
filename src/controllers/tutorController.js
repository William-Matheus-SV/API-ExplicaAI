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

module.exports = {
    cadastrarTutor,
    listarTutores,
    buscarTutor
};

// adicionei o "tutorController.js" na main!