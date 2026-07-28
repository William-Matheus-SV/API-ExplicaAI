const express = require("express");

const router = express.Router();

const tutorController = require("../controllers/tutorController");

router.post("/tutores/cadastro", tutorController.cadastrarTutor);

// Listar todos
router.get("/tutores", tutorController.listarTutores);

// Buscar por matrícula
router.get("/tutores/:matricula", tutorController.buscarTutor);

module.exports = router;