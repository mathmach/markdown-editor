const request = require("supertest");
const server = require("../src/server"); // Importar o app para rodar testes
const mongoose = require("mongoose");
const User = require("../src/models/User"); // Importe o modelo User
const jwt = require("jsonwebtoken");
const jwtConfig = require("../src/config/jwtConfig");

beforeAll(async () => {
  // Conectar ao banco de dados de teste
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Limpar todos os dados após cada teste
  await User.deleteMany({});
  // Desconectar do banco de dados após todos os testes
  await mongoose.connection.close();
  // Fechar o servidor
  server.close();
});

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(server).post("/api/auth/register").send({
      username: "register",
      email: "register@example.com",
      password: "testpassword",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should login a user", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "register@example.com",
      password: "testpassword",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 200 and validate token", async () => {
    // Gerar um token JWT válido para o teste
    const token = jwt.sign(
      { id: "user123", email: "user@test.com" },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // Fazer uma requisição para o endpoint com o token válido
    const response = await request(server)
      .post("/api/auth/refresh-token")
      .send({ token }); // Passar o token no cabeçalho

    // Verificar a resposta
    expect(response.status).toBe(200); // O status deve ser 200
    expect(response.body).toEqual({ message: "Token is valid" });
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(server).post("/api/auth/refresh-token");

    // Verificar que não passou o token, então o status deve ser 401
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token provided");
  });

  it("should return 403 if the token is invalid", async () => {
    const invalidToken = "invalidToken123";

    const response = await request(server)
      .post("/api/auth/refresh-token")
      .send({ token: invalidToken }); // Passar um token inválido

    // Verificar que o token inválido resulta em 403
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Unauthorized");
  });
});
