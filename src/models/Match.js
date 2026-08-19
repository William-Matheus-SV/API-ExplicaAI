const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
    {
    alunoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required:[true, "O Match precisa estar vinculado a um aluno"]
    },

    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor",
        required: [true, "O Match precisa estar vinculado a um tutor"]
    },

    agendaSlotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agenda",
        required: [true, "O Match precisa estar vinculado a um horário da agenda"]
    },

    dataHoraAgendada: {
        type: Date,
        required: [true, "A mentoria precisa ter data e horário definidos"]
    },

    status: {
        type: String,
        enum: {
            values: ["confirmado", "realizado", "cancelado"],
            message: "Status inválido para o Match"
        },
        default: "confirmado"
    },

    confirmacaoAluno: {
        type: Boolean,
        default: false
    },

    confirmacaoTutor: {
        type: Boolean, 
        default: false
    },
    },
   
    {
    timestamps: true
  }
);


module.exports = mongoose.model("Match", matchSchema);