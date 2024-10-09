const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    content: { type: String }, // Conteúdo em Markdown da versão
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Version', versionSchema);
