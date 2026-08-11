const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const verificarToken = require("../middlewares/verificarToken");

router.post("/", verficarToken, matchController.criarMatch);
router.patch("/:id/confirm", verificarToken, matchController.confirmarPresenca);
router.patch("/:id/cancel", verificarToken, matchController.cancelarMatch);
router.get("/meus/proximos", verificarToken, matchController.listarProximosDoAluno);
router.get("/meus/realizados", verificarToken, matchController.listarRealizadosDoTutor);

module.exports = router;