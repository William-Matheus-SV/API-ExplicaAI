const mongoose = require("mongoose");

const admSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: [true, "Nome obrigatório"],
        trim: true
    },

//    email: {
//        type: String,
//        required: [true, "Email obrigatório"],
//        trim: true
//    },

    matricula: {
        type: String,
        required: [true, "A matrícula é obrigatória"],
    },

    senha: {
        type: String,
        required: [true , "A senha é obrigatória"]
    }
    
}, {
    timestamps: true // removi o "tipo" do adm pois nosso projeto já possui um model separado para Adm e adicionei o "timestamps para registrar a criação e a atualização do Adm caso hajá"

});

module.exports = mongoose.model("Adm", admSchema);