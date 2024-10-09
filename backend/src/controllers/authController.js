const { registerUser, loginUser } = require("../services/userService");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res
      .status(200)
      .json({ token, user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      req.userId = decoded.id;
      return res.status(200).json({ message: "Token is valid" });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login, refreshToken };
