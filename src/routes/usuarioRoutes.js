const express = require("express");//teste

const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const uploadFoto = require("../middlewares/uploadFoto");

router.post("/usuarios", usuarioController.cadastrarUsuario);
router.get("/usuarios/:matricula", usuarioController.buscarUsuario);
router.put("/usuarios/:matricula", usuarioController.atualizarUsuario);
router.post("/usuarios/:matricula/foto", uploadFoto.single("foto"),usuarioController.atualizarFotoPerfil);

module.exports = router;

