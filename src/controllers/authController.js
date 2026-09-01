const Usuario = require("../models/Usuario");
const Tutor = require("../models/Tutor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUsuario = async (req, res) => {
    try {
        const { matricula, senha } = req.body;

        // Seleciona a senha explicitamente, pois ela não é retornada por padrão
        const usuario = await Usuario.findOne({ matricula }).select("+senha");

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
            { id: usuario._id, matricula: usuario.matricula, tipo: "aluno" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                matricula: usuario.matricula,
                idade: usuario.idade,
                bio: usuario.bio,
                materias: usuario.materias || []
            }
        });

    } catch (error) {
        console.error("Erro ao realizar login:", error);
        res.status(500).json({
            message: "Erro ao realizar login",
            error: error.message
        });
    }
};

const loginTutor = async (req, res) => {
    try {
        const { matricula, senha } = req.body;

        const tutor = await Tutor.findOne({ matricula }).select("+senha");

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

        // Bloqueia login de tutor cujo cadastro ainda não foi aprovado pelo Admin
        if (tutor.status_aprovacao !== "aprovado") {
            return res.status(403).json({
                message: "Seu cadastro ainda não foi aprovado. Aguarde a análise do administrador."
            });
        }

        const token = jwt.sign(
            { id: tutor._id, matricula: tutor.matricula, tipo: "tutor" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            tutor: {
                id: tutor._id,
                nome: tutor.nome,
                idade: tutor.matricula,
                idade: tutor.idade,
                bio: tutor.bio,
                materiasLecionadas: tutor.materiasLecionadas || [],
                agendaDisponivel: tutor.agendaDisponivel || []
            }
        });

    } catch (error) {
        console.error("Erro ao realizar login:", error);
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