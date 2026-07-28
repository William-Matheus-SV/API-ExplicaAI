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

    agendaDisponivel: [{
        dia: {
            type: String
        },
        horario: {
            type: String
        }
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model("Tutor", tutorSchema);