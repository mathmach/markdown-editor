const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');

const registerUser = async (userData) => {
    const { username, email, password } = userData;
    
    // Verificar se o email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    return await newUser.save();
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    return { token, user };
};

module.exports = { registerUser, loginUser };
