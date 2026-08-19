const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { materiasValidas } = require("../constants/materiasValidas");

const usuarioSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: [true, "O nome é obrigatório"],
        trim: true,
        match: [/^[A-Za-zÀ-ÿ\s]+$/, "O nome não pode conter números ou símbolos"]
    },

    matricula: {
        type: String,
        required: [true, "A matrícula é obrigatória"],
        unique: true,
        trim: true,
        match: [/^\d{6}$/, "A matrícula deve conter exatamente 6 dígitos numéricos"]
    },

    idade: {
        type: Number,
        required: [true, "A idade é obrigatória"],
        min: [14, "Idade mínima permitida é 14 anos"],
        max: [100, "Idade máxima permitida é 100 anos"]
    },

    materias: [{
        type: String,
        required: [true, "As matérias são obrigatórias"],
        trim: true,
        enum: {
            values: materiasValidas,
            message: "Matéria inválida — escolha uma das opções disponíveis no sistema"
        }
    }],

    bio: {
        type: String,
        trim: true,
        maxlength: [500, "A biografia não pode passar de 500 caracteres"],
        required: [true, "A biografia é obrigatória"]
    },

    /*email: {
        type: String,
        required: [true, "O e-mail é obrigatório"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Por favor, insira um e-mail válido"]
    },
    */

    senha: {
        type: String,
        required: [true, "A senha é obrigatória"],
        // PIN numérico de 6 dígitos (decisão de produto para o MVP)
        match: [/^\d{6}$/, "A senha deve ser um PIN de exatamente 6 dígitos numéricos"],
        select: false
    }
}, {
    timestamps: true
});

// Roda antes de qualquer .save() — hash automático, só quando a senha muda de verdade
usuarioSchema.pre("save", async function () {
    if (!this.isModified("senha")) return;
    this.senha = await bcrypt.hash(this.senha, 10);
});

module.exports = mongoose.model("Usuario", usuarioSchema);