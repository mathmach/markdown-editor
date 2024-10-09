const express = require('express');
const { createDocument, getDocuments, getDocumentById, updateDocument, deleteDocument } = require('../controllers/documentController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createDocument); // Criar documento
router.get('/', verifyToken, getDocuments); // Obter todos os documentos do autor
router.get('/:id', verifyToken, getDocumentById); // Obter documento por ID
router.put('/:id', verifyToken, updateDocument); // Atualizar documento
router.delete('/:id', verifyToken, deleteDocument); // Deletar documento

module.exports = router;
