const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
router.post("/login/aluno", validarLogin, authController.loginUsuario); // Rota POST para login de usuário
router.post("/login/tutor", validarLogin, authController.loginTutor); // Rota POST para login de tutor
router.post("/login/aluno", authController.loginUsuario); // Rota POST para login de usuário
router.post("/login/tutor", authController.loginTutor); // Rota POST para login de tutor

module.exports = router;