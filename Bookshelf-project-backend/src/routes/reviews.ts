import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

// Obtener todas las reseñas con título y autor del libro
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        r.id, 
        r.book_id, 
        r.comment, 
        DATE_FORMAT(r.date, '%Y-%m-%d') AS created_at,
        b.title AS book_title
        FROM reviews r
        JOIN books b ON r.book_id = b.id
        ORDER BY r.id DESC;`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
});

// Crear nueva reseña
router.post("/", async (req: Request, res: Response) => {
  try {
    const { book_id, comment } = req.body;

    const [result] = await db.execute(
      "INSERT INTO reviews (book_id, comment) VALUES (?, ?)",
      [book_id, comment]
    );

    res.status(201).json({ message: "Reseña creada correctamente", id: (result as any).insertId });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ error: "Error al crear reseña" });
  }
});

export default router;
