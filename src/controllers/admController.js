const Adm = require("../models/Adm");

// Cadastrar ADM
const cadastrarAdm = async (req, res) => {

    try {

        const {
            nome,
            email,
            senha
        } = req.body;

        const novoAdm = new Adm({
            nome,
            email,
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


module.exports = {
    cadastrarAdm,
    listarAdms
};