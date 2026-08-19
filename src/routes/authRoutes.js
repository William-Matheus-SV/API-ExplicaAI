const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validarLogin = require("../middlewares/validarLogin");

router.post("/login/aluno", validarLogin, authController.loginUsuario);
router.post("/login/tutor", validarLogin, authController.loginTutor);

module.exports = router;