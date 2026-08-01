const express = require("express");

const router = express.Router();

const {
    loginAdm,
    visualizarAdm
} = require("../controllers/admController");

router.post("/login", loginAdm);

router.get("/", visualizarAdm);

module.exports = router;