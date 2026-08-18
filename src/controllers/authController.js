const Usuario = require("../models/Usuario");
const Tutor = require("../models/Tutor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUsuario = async (req, res) => {
    try {
        const { matricula, senha } = req.body;

        const usuario = await Usuario.findOne({ matricula });

        if (!usuario) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                message: "Senha incorreta"
            });
        }

        const token = jwt.sign(
            {
                id: usuario._id,
                matricula: usuario.matricula
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro ao realizar login",
            error: error.message
        });
    }
};


const loginTutor = async (req, res) => {
    try {
        const { matricula, senha } = req.body;

        const tutor = await Tutor.findOne({ matricula });

        if (!tutor) {
            return res.status(404).json({
                message: "Tutor não encontrado"
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, tutor.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                message: "Senha incorreta"
            });
        }

        const token = jwt.sign(
            {
                id: tutor._id,
                matricula: tutor.matricula
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            tutor: {
                id: tutor._id,
                nome: tutor.nome
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro ao realizar login",
            error: error.message
        });
    }
};


module.exports = {
    loginUsuario,
    loginTutor
};