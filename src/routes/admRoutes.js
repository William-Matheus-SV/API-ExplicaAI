const express = require("express");

const router = express.Router();

const admController = require("../controllers/admController");

router.post("/adms/cadastro", admController.cadastrarAdm);

router.get("/adms", admController.listarAdms);

module.exports = router;