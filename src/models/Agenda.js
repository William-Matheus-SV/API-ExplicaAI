const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({

    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: [true, "O horário precisa estar vinculado a um tutor."]
    },

    dataHorarioInicio :{
        type: Date,
        required: [true, "O horário precisa ter uma data e hora de início."]
    },

    duracao: {
        type: Number,
        enum: {
            values: [1,2],
            message: "A duração do horário deve ser de 1 ou 2 horas."
        },
        required: [true, "O horário precisa ter uma duração."]
    },

    status: {
        type: String,
        enum: {
            values: ['disponivel', 'reservado'],
            message: "Status inválido para o horário"
        },
        default: 'disponivel'
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Agenda', agendaSchema);