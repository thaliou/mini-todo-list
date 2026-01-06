const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// INSCRIPTION
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const userExiste = await User.findOne({ email });
  if (userExiste) {
    return res.status(400).json({ message: "Utilisateur déjà existant" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: passwordHash
  });

  await user.save();
  res.status(201).json({ message: "Utilisateur créé ✅" });
});

// CONNEXION
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Identifiants invalides" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).json({ message: "Identifiants invalides" });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;
