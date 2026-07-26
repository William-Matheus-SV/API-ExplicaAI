const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true,
        trim: true
    },

    matricula: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    idade: {
        type: Number,
        required: [true, "A idade é obrigatória"],
        min: [14, "Idade mínima permitida é 14 anos"],
        max: [100, "Idade máxima permitida é 100 anos"]
    },

    materias: [{
        type: String,
        trim: true
    }],

    bio: {
        type: String,
        trim: true,
        maxlength: [500, "A biografia não pode passar de 500 caracteres"]
    },

    email: {
        type: String,
        required: [true, "O e-mail é obrigatório"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Por favor, insira um e-mail válido"]
    },

    senha: {
        type: String,
        required: [true , "A senha é obrigatória"],
        minlength: [6, "A senha deve ter no mínimo 6 caracteres"]
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Usuario", usuarioSchema);