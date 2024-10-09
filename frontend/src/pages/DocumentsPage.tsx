import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete"; // Ícone de lixeira
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDocuments } from "../hooks/useDocuments";

interface Document {
  _id: string;
  title: string;
  author: string;
  updatedAt: Date;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { user } = useAuth();
  const { getAllDocuments, createDocument, deleteDocument } = useDocuments();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      const fetchedDocuments = await getAllDocuments();
      setDocuments(fetchedDocuments);
    };

    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateNew = async () => {
    const newDocument = await createDocument(user.id);
    navigate(`/editor/${newDocument._id}`);
  };

  const handleDelete = async (docId: string) => {
    if (window.confirm("Tem certeza que deseja apagar este documento?")) {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((doc) => doc._id !== docId)); // Atualiza a lista de documentos
    }
  };

  return (
    <Box padding="20px">
      <Grid container spacing={2}>
        {/* Card para criar novo documento */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={handleCreateNew}
            sx={{
              cursor: "pointer",
              transition: "transform 0.2s",
              height: "200px", // Defina a altura fixa que deseja
              "&:hover": { transform: "scale(1.02)" },
              backgroundColor: "#e3f2fd", // Cor de fundo clara
              border: "1px dashed #2196f3", // Borda para diferenciar
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddCircleOutlineIcon fontSize="large" color="primary" />
            <Typography variant="h6" style={{ marginLeft: "10px" }}>
              Criar Novo Documento
            </Typography>
          </Card>
        </Grid>

        {/* Lista de documentos existentes */}
        {documents.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc._id}>
            <Card
              sx={{
                position: "relative", // Para posicionar o ícone de lixeira
                cursor: "pointer",
                transition: "transform 0.2s",
                height: "200px", // Defina a altura fixa que deseja
                "&:hover": { transform: "scale(1.02)" },
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => navigate(`/editor/${doc._id}`)}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(doc._id);
                }}
                sx={{
                  position: "absolute", // Posiciona o ícone no canto superior direito
                  top: 10,
                  right: 10,
                }}
              >
                <DeleteIcon />
              </IconButton>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5">{doc.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Última modificação: {new Date(doc.updatedAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DocumentsPage;
