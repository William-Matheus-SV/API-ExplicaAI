const mongoose = require("mongoose");

const admSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    senha: {
        type: String,
        required: true
    },

    tipo: {
        type: String,
        default: "adm"
    }

});

module.exports = mongoose.model("Adm", admSchema);