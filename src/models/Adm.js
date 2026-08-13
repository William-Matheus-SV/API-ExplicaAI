const mongoose = require("mongoose");

const admSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    senha: {
        type: String,
        required: true
    }
    
}, {
    timestamps: true // removi o "tipo" do adm pois nosso projeto já possui um model separado para Adm e adicionei o "timestamps para registrar a criação e a atualização do Adm caso hajá"

});

module.exports = mongoose.model("Adm", admSchema);