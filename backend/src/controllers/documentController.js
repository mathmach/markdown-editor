const Document = require("../models/Document");
const Version = require("../models/Version");

// Criar um novo documento
const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = new Document({ title: title || "Untitled", content, author: req.userId });
    await document.save();
    
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obter todos os documentos do autor
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ author: req.userId });
    res.status(200).json(documents);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obter um documento por ID
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });
    res.status(200).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Atualizar um documento
const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );

    if (!document)
      return res.status(404).json({ message: "Document not found" });

    res.status(200).json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deletar um documento
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    // Deletar todas as versões do documento
    await Version.deleteMany({ documentId: document._id });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};
