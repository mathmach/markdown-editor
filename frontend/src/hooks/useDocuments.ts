import axios from "../axiosConfig";

interface DocumentsContextType {
  createDocument: (userId: string) => Promise<any>;
  updateDocument: (documentId: string, content: string) => Promise<any>;
  deleteDocument: (documentId: string) => Promise<any>;
  getAllDocuments: () => Promise<any>;
  saveVersion: (documentId: string, content: string) => Promise<any>;
  fetchVersions: (documentId: string) => Promise<any>;
  getDocument: (documentId: string) => Promise<any>;
}

export const useDocuments = (): DocumentsContextType => {
  const createDocument = async (userId: string) => {
    const response = await axios.post("/documents", { userId });
    return response.data;
  };

  const updateDocument = async (documentId: string, content: string) => {
    return await axios.put(`/documents/${documentId}`, { content });
  };

  const deleteDocument = async (documentId: string) => {
    return await axios.delete(`/documents/${documentId}`);
  };

  const getAllDocuments = async () => {
    const response = await axios.get("/documents");
    return response.data;
  };

  const saveVersion = async (documentId: string, content: string) => {
    const response = await axios.post(`/versions/${documentId}`, {
      content,
    });
    return response.data;
  };

  const fetchVersions = async (documentId: string) => {
    const response = await axios.get(`/versions/${documentId}`);
    return response.data;
  };

  const getDocument = async (documentId: string) => {
    const response = await axios.get(`/documents/${documentId}`);
    return response.data;
  };

  return {
    createDocument,
    updateDocument,
    deleteDocument,
    getAllDocuments,
    saveVersion,
    fetchVersions,
    getDocument,
  };
};
