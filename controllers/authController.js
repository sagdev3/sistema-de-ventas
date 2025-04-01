const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const allowedCodes = [
  { code: "ABC1234", expires_on: new Date("2025-12-31T23:59:59Z"), used: false },
  { code: "XYZ9876", expires_on: new Date("2025-12-31T23:59:59Z"), used: false },
  { code: "1234ABC", expires_on: new Date("2025-12-31T23:59:59Z"), used: false },
  { code: "XYZ1234", expires_on: new Date("2025-12-31T23:59:59Z"), used: false }
];

exports.registerLeader = async (req, res) => {
  try {
    const { name, email, password, registrationCode } = req.body;
    if (!name || !email || !password || !registrationCode) {
      return res.status(400).json({ message: "Todos los campos son requeridos." });
    }
    const codeObj = allowedCodes.find(c => c.code === registrationCode);
    if (!codeObj) {
      return res.status(400).json({ message: "Código de invitación inválido." });
    }
    if (new Date() > codeObj.expires_on) {
      return res.status(400).json({ message: "El código ha expirado." });
    }
    if (codeObj.used) {
      return res.status(400).json({ message: "El código ya ha sido utilizado." });
    }
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword, registrationCode });
    await user.save();
    codeObj.used = true;
    res.status(201).json({ message: "Líder registrado exitosamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginLeader = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta." });
    }
    res.json({ message: "Login exitoso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
