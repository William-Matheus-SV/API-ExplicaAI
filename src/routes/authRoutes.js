const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.loginUsuario); // Rota POST para login de usuário

module.exports = router;