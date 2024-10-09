const Version = require("../models/Version");

// Salvar uma nova versão do documento
const saveVersion = async (req, res) => {
  const { documentId } = req.params;
  const { content } = req.body;
  const version = new Version({ documentId, content });
  await version.save();
  res.status(201).json(version);
};

// Obter versões de um documento
const getVersions = async (req, res) => {
  const { documentId } = req.params;
  const versions = await Version.find({ documentId }).sort({ createdAt: 1 }); // Ordenar por data
  res.status(200).json(versions);
};

module.exports = { saveVersion, getVersions };
