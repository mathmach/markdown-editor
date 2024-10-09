import { Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useDocuments } from "../hooks/useDocuments";

const EditorPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { updateDocument, getDocument, fetchVersions, saveVersion } =
    useDocuments();
  const [document, setDocument] = useState<string>("");
  const [usersEditing, setUsersEditing] = useState<string[]>([]); // Lista de usuários editando

  // Histórico de versões
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1); // Índice da versão atual

  // Conectar ao Socket.IO
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const document = await getDocument(documentId as string);
        setDocument(document.content);
      } catch (error) {
        console.error("Erro ao buscar documento:", error);
        navigate("/documents");
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await fetchVersions(documentId as string);
        setHistory(response.map((v: any) => v.content));
        setCurrentIndex(response.length - 1);
      } catch (error) {
        console.error("Erro ao buscar versões:", error);
      }
    };

    fetchDocument();
    fetchHistory();
    socket.connect(); // Conecta o socket
    socket.emit("join-document", documentId, user.username); // Enviar evento ao servidor para juntar-se ao documento

    // Escutar atualizações do documento
    socket.on("document-updated", (newDocument: any) => {
      setDocument(newDocument.content);
    });

    // Escutar usuários que estão editando
    socket.on("active-users", (activeUsers: any[]) => {
      setUsersEditing(
        Array.from(new Set(activeUsers.map((user) => user.username)))
      );
    });

    // Limpeza da conexão ao desmontar o componente
    return () => {
      socket.off("document-updated"); // Remove o listener
      socket.off("active-users"); // Remove o listener
      socket.disconnect(); // Desconecta o socket
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, user, socket]);

  // Função para atualizar o documento
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(history.length - 1);
    const newDocument = e.target.value;
    update(newDocument);
  };

  const update = async (content: string) => {
    setDocument(content);
    await updateDocument(documentId as string, content);
    socket.emit("edit-document", { documentId, content, user });
  };

  const handleSave = () => {
    // Adiciona a versão atual ao histórico antes de salvar
    if (currentIndex < history.length - 1) {
      setHistory(history.slice(0, currentIndex + 1)); // Remove versões futuras
    }
    setHistory((prev) => [...prev, document]); // Adiciona a nova versão
    setCurrentIndex(currentIndex + 1);
    saveVersion(documentId as string, document);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      update(history[currentIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      update(history[currentIndex + 1]);
    }
  };

  return (
    <Box padding="20px">
      <Typography variant="subtitle1">
        Usuários Editando: {usersEditing.join(", ")}
      </Typography>
      <Toolbar style={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleUndo}
          disabled={currentIndex <= 0}
          style={{ marginRight: "10px" }}
        >
          Desfazer
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRedo}
          disabled={currentIndex >= history.length - 1}
          style={{ marginRight: "10px" }}
        >
          Refazer
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          style={{ marginRight: "10px" }}
        >
          Salvar
        </Button>
      </Toolbar>
      <TextField
        label="Conteúdo do Documento"
        variant="outlined"
        fullWidth
        multiline
        rows={10}
        value={document}
        onChange={handleChange}
        margin="normal"
      />
    </Box>
  );
};

export default EditorPage;
