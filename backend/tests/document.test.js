require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const mongoose = require("mongoose");
const server = require("../src/server"); // Certifique-se de que o caminho está correto
const Document = require("../src/models/Document");

let token;
let userId;
let documentId;

beforeAll(async () => {
  // Conectar ao banco de dados de teste
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Criar um usuário para os testes
  const user = await request(server).post("/api/auth/register").send({
    username: "testuser",
    email: "test@example.com",
    password: "testpassword",
  });

  userId = user.body._id;
  // Login para obter um token
  const loginResponse = await request(server).post("/api/auth/login").send({
    email: "test@example.com",
    password: "testpassword",
  });

  token = loginResponse.body.token;
});

afterAll(async () => {
  // Limpar todos os dados após cada teste
  await Document.deleteMany({});
  // Desconectar do banco de dados após todos os testes
  await mongoose.connection.close();
  // Fechar o servidor
  server.close();
});

describe("Document API", () => {
  it("should create a new document", async () => {
    const res = await request(server)
      .post("/api/documents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Document",
        content: "# Hello World",
      });

    documentId = res.body._id; // Salvar o ID do documento criado
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title", "Test Document");
  });

  it("should get all documents", async () => {
    await request(server)
      .post("/api/documents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Document 2",
        content: "# Hello World 2",
      });

    const res = await request(server)
      .get("/api/documents")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0); // Esperamos que haja pelo menos um documento
  });

  it("should get a document by ID", async () => {
    const res = await request(server)
      .get(`/api/documents/${documentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "Test Document");
  });

  it("should update a document", async () => {
    const res = await request(server)
      .put(`/api/documents/${documentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Document",
        content: "# Updated Content",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "Updated Document");
  });

  it("should delete a document", async () => {
    const res = await request(server)
      .delete(`/api/documents/${documentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(204); // No Content
  });
});
