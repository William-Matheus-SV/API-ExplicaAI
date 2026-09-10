const express = require("express");//teste

const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/usuarios", usuarioController.cadastrarUsuario);
router.get("/usuarios/:matricula", usuarioController.buscarUsuario);
router.put("/usuarios/:matricula", usuarioController.atualizarUsuario);

module.exports = router;

