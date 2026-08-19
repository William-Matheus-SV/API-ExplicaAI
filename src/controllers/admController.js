const Adm = require("../models/Adm");
const Tutor = require("../models/Tutor");

// Cadastrar ADM
const cadastrarAdm = async (req, res) => {

    try {

        const {
            nome,
            matricula,
            senha
        } = req.body;

        const novoAdm = new Adm({
            nome,
            matricula,
            senha
        });

        await novoAdm.save();

        res.status(201).json({
            mensagem: "Administrador cadastrado com sucesso!",
            adm: novoAdm
        });

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro ao cadastrar administrador.",
            erro: erro.message
        });

    }
};

// Listar ADMs
const listarAdms = async (req, res) => {

    try {

        const adms = await Adm.find();

        res.status(200).json(adms);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro ao listar administradores.",
            erro: erro.message
        });

    }
};


// Alterar status de aprovação do Tutor
const alterarStatusTutor = async (req, res) => {

    try {

        const { status } = req.body;

        const tutor = await Tutor.findById(req.params.id);

        if (!tutor) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        tutor.status_aprovacao = status;

        await tutor.save();

        res.status(200).json({
            mensagem: "Status do tutor atualizado com sucesso!",
            tutor: tutor
        });

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro ao alterar status do tutor.",
            erro: erro.message
        });

    }

};


module.exports = {
    cadastrarAdm,
    listarAdms,
    alterarStatusTutor
};