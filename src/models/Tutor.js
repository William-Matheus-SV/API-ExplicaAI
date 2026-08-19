const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { materiasValidas } = require("../constants/materiasValidas");

const tutorSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: [true, "O nome é obrigatório"],
        trim: true,
        match: [/^[A-Za-zÀ-ÿ\s]+$/, "O nome não pode conter números ou símbolos"]
    },

    idade: {
        type: Number,
        required: [true, "A idade é obrigatória"],
        min: [16, "Idade mínima permitida é 16 anos"],
        max: [100, "Idade máxima permitida é 100 anos"]
    },

    matricula: {
        type: String,
        required: [true, "A matrícula é obrigatória"],
        unique: true,
        trim: true,
        match: [/^\d{6}$/, "A matrícula deve conter exatamente 6 dígitos numéricos"]
    },

    senha: {
        type: String,
        required: [true, "A senha é obrigatória"],
        match: [/^\d{6}$/, "A senha deve ser um PIN de exatamente 6 dígitos numéricos"],
        select: false
    },

    bio: {
        type: String,
        required: [true, "A biografia é obrigatória"],
        maxlength: [500, "A biografia não pode passar de 500 caracteres"]
    },

   // email: {
      //  type: String,
       // required: [true, "O e-mail é obrigatório"],
       // unique: true,
       // lowercase: true,
      //  trim: true,
      //  match: [/\S+@\S+\.\S+/, "Por favor, insira um e-mail válido"]
  //  },

    materiasLecionadas: [{
        type: String,
        required: [true, "As matérias lecionadas são obrigatórias"],
        trim: true,
        enum: {
            values: materiasValidas,
            message: "Matéria inválida — escolha uma das opções disponíveis no sistema"
        }
    }],

    status_aprovacao: {
        type: String,
        enum: ["pendente", "aprovado", "rejeitado"],
        default: "pendente"
    },

    ativo: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

// Mesmo hook do Usuario.js — hash automático, só quando a senha muda de verdade
// Hash automático da senha
tutorSchema.pre("save", async function () {

    if (!this.isModified("senha")) return;

    this.senha = await bcrypt.hash(this.senha, 10);

});

module.exports = mongoose.model("Tutor", tutorSchema);