import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from '../db';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

//Registrar un usuario


router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await db.execute("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", [username, email, hashed]);
  res.status(201).json({ message: "User registered" });
});

//Iniciar sesión de un usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const [rows]: any = await db.execute("SELECT * FROM user WHERE email = ?", [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token, user });
});

export default router;
