const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/perfis");
    },

    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname);

        const nomeArquivo = `${req.params.matricula}-${Date.now()}${extensao}`;

        cb(null, nomeArquivo);
    }
});

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Apenas imagens JPG, PNG ou WEBP são permitidas."));
    }
};

const uploadFoto = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = uploadFoto;