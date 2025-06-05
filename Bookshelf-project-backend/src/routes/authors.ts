import express from "express";
import { db } from '../db';

const router = express.Router();

//Obtener todos los autores
router.get("/", async (req, res) => {
  const [authors] = await db.execute("SELECT * FROM author");
  res.json(authors);
});

//Añadir un autor
router.post("/", async (req, res) => {
  const { name } = req.body;
  await db.execute("INSERT INTO author (name) VALUES (?)", [name]);
  res.status(201).json({ message: "Author added" });
});

// Borrar un autor por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const authorId = Number(id);
  if (isNaN(authorId)) {
    return res.status(400).json({ message: "Invalid author ID" });
  }
  await db.execute("DELETE FROM author WHERE id = ?", [authorId]);
  res.status(200).json({ message: "Author deleted" });
});

export default router;
