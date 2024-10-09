const express = require('express');
const { saveVersion, getVersions } = require('../controllers/versionController');
const verifyToken = require('../middlewares/authMiddleware'); // Certifique-se de proteger as rotas

const router = express.Router();

router.post('/:documentId', verifyToken, saveVersion); // Salvar nova versão
router.get('/:documentId', verifyToken, getVersions); // Obter versões de um documento

module.exports = router;
