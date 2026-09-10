const express = require("express");

const router = express.Router();

const tutorController = require("../controllers/tutorController");

router.post("/tutores/cadastro", tutorController.cadastrarTutor);

// Listar todos
router.get("/tutores", tutorController.listarTutores);

// Buscar por matrícula
router.get("/tutores/:matricula", tutorController.buscarTutor);

// Atualizar tutor
router.put("/tutores/:matricula", tutorController.atualizarTutor);

module.exports = router;

// rotas conectadas com o banco local, então quando for usar certifique-se de usar o banco LOCAL!