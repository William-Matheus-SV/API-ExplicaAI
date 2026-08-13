const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agendaController");
const verificarToken = require("../middlewares/verificarToken");

router.post("/", verificarToken, agendaController.criarSlot);
router.get("/minha", verificarToken, agendaController.listarMeusSlots);
router.delete("/:id", verificarToken, agendaController.removerSlot);
router.get("/tutor/:tutorId", agendaController.listarSlotsDoTutor);

module.exports = router;