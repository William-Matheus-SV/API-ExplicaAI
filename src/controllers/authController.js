const Usuario = require("../models/Usuario");

const loginUsuario = async (req, res) => {
    try{
        const {email, senha} = req.body;
        
        // Verifica se o usuário existe no banco de dados
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(404).json({message: "Usuário não encontrado"});
        }
        // Verifica se a senha está correta
        if(usuario.senha !== senha){
            return res.status(401).json({message: "Senha incorreta"});
        }

        res.status(200).json({
            message: "Login realizado com sucesso",
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
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