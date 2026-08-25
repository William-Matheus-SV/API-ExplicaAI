const mongoose = require("mongoose");

const avaliacaoSchema = new mongoose.Schema({

    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
        required: [true, "A avaliação precisa estar vinculada a um match"]
    },

    // Quem escreveu a avaliação
    avaliadorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "É necessário identificar quem avaliou"]
    },
    avaliadorTipo: {
        type: String,
        enum: ["aluno", "tutor"],
        required: true
    },

    // Quem recebeu a avaliação
    avaliadoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "É necessário identificar quem foi avaliado"]
    },
    avaliadoTipo: {
        type: String,
        enum: ["aluno", "tutor"],
        required: true
    },

    nota: {
        type: Number,
        required: [true, "A nota é obrigatória"],
        min: [1, "A nota mínima é 1"],
        max: [5, "A nota máxima é 5"]
    },

    comentario: {
        type: String,
        trim: true,
        maxlength: [500, "O comentário não pode passar de 500 caracteres"]
    }

}, {
    timestamps: true
});

// Trava: a mesma pessoa não pode avaliar o mesmo match mais de uma vez.
// Isso permite até 2 avaliações por match (uma do aluno, uma do tutor) — nunca duas do mesmo avaliador.
avaliacaoSchema.index({ matchId: 1, avaliadorId: 1 }, { unique: true });

module.exports = mongoose.model("Avaliacao", avaliacaoSchema);