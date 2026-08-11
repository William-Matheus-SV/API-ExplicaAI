const express = require("express");

const router = express.Router();

const admController = require("../controllers/admController");

// Cadastro de ADM
router.post(
    "/adms/cadastro",
    admController.cadastrarAdm
);

// Listar ADMs
router.get(
    "/adms",
    admController.listarAdms
);

// ADM altera o status de aprovação de um Tutor
router.patch(
    "/tutores/:id/status",
    admController.alterarStatusTutor
);

module.exports = router;