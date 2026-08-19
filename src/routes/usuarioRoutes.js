const express = require("express");//teste

const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/usuarios", usuarioController.cadastrarUsuario);

module.exports = router;

