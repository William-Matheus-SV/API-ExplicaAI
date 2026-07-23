const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUsuario = async (req, res) => {
    try{
        const {email, senha} = req.body;
        
        // Verifica se o usuário existe no banco de dados
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(404).json({message: "Usuário não encontrado"});
        }

        // Verifica se a senha está correta
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if(!senhaCorreta){
            return res.status(401).json({message: "Senha incorreta"});
        }
        const token = jwt.sign(
            {id: usuario._id, email: usuario.email},
             process.env.JWT_SECRET,{expiresIn: "1h"}
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
            message: "Erro ao realizar login", error
        });
    }
};

module.exports = {
    loginUsuario
};