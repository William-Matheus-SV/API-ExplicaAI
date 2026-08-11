const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },

    idade: {
        type: Number,
        required: true
    },

    matricula: {
        type: String,
        required: true,
        unique: true
    },

    senha: {
        type: String,
        required: true
    },

    bio: {
        type: String,
        required: true
    },

    materiasLecionadas: [{
        type: String
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

module.exports = mongoose.model("Tutor", tutorSchema);

// aqui eu criei um arquivo para receber e armazenar todas as informações do tutor, e já subi para a main!