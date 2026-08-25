const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");
const verificarToken = require("../middlewares/verificarToken");

router.post("/", verificarToken, avaliacaoController.criarAvaliacao);
router.get("/minhas", verificarToken, avaliacaoController.listarMinhasAvaliacoes);
router.get("/tutor/:tutorId", avaliacaoController.listarAvaliacoesDoTutor);

module.exports = router;