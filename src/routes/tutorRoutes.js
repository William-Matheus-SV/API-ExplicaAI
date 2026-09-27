const express = require("express");

const router = express.Router();

const tutorController = require("../controllers/tutorController");
const uploadFoto = require("../middlewares/uploadFoto");

router.post("/tutores/cadastro", tutorController.cadastrarTutor);

// Listar todos
router.get("/tutores", tutorController.listarTutores);

// Buscar por matrícula
router.get("/tutores/:matricula", tutorController.buscarTutor);

// Atualizar tutor
router.put("/tutores/:matricula", tutorController.atualizarTutor);

// Atualizar foto perfil
router.post("/tutores/:matricula/foto",uploadFoto.single("foto"),tutorController.atualizarFotoPerfil);

module.exports = router;

// rotas conectadas com o banco local, então quando for usar certifique-se de usar o banco LOCAL!