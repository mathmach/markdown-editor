const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const versionRoutes = require("./routes/versionRoutes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app); // Criar o servidor HTTP
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*", // Definir a origem permitida (ou especificar domínios específicos)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/versions", versionRoutes);
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

const connectedUsers = {}; // Armazena usuários conectados por documento

// Evento de conexão do Socket.IO
io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("join-document", (documentId, username) => {
    socket.join(documentId);
    if (!connectedUsers[documentId]) {
      connectedUsers[documentId] = new Set(); // Inicializa um conjunto para usuários conectados ao documento
    }
    connectedUsers[documentId].add({ username, socketId: socket.id }); // Adiciona o usuário ao conjunto
    console.log(
      `Usuário ${username} entrou na sala do documento ${documentId}`
    );

    // Emitir a lista de usuários conectados para todos na sala
    io.to(documentId).emit(
      "active-users",
      Array.from(connectedUsers[documentId])
    );
  });

  socket.on("cursor-position", ({ documentId, username, range }) => {
    socket.to(documentId).emit("user-cursor", { username, range });
  });

  socket.on("edit-document", ({ documentId, content }) => {
    socket.to(documentId).emit("document-updated", { content });
  });

  socket.on("disconnect", () => {
    // Remover o usuário de todos os documentos
    Object.keys(connectedUsers).forEach((documentId) => {
      connectedUsers[documentId].forEach((user) => {
        if (user.socketId === socket.id) {
          connectedUsers[documentId].delete(user);
        }
      });
      // Emitir a lista atualizada de usuários para todos os usuários na sala
      io.to(documentId).emit(
        "active-users",
        Array.from(connectedUsers[documentId])
      );
    });
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
