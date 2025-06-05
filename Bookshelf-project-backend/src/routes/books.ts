import { Router, Request, Response } from 'express';
import multer from 'multer';
import { db } from '../db';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Configurar multer para subir imágenes de portada
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Obtener todos los libros
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(`
      SELECT book.*, author.name AS author
      FROM book
      LEFT JOIN author ON book.author_id = author.id
      ORDER BY book.id DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error al obtener libros' });
  }
});

//Obtener un libro
router.get('/:id', async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  try {
    const [rows] = await db.execute(`
      SELECT book.*, author.name AS author
      FROM book
      LEFT JOIN author ON book.author_id = author.id
      WHERE book.id = ?
    `, [bookId]);
    const book = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    res.json(book); 
  } catch (error) {
    console.error('Error al obtener libro:', error);
    res.status(500).json({ error: 'Error al obtener libro' });
  }
});


// Crear nuevo libro
router.post('/', upload.single('cover_image'), async (req: Request, res: Response) => {
  try {
    const { title, author_id, page_count, status, start_date, end_date, rating } = req.body;
    const cover_image = req.file?.filename || null;

    const [result] = await db.execute(
      'INSERT INTO book (title, author_id, page_count, status, start_date, end_date, rating, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author_id, page_count, status, start_date || null, end_date || null, rating || null, cover_image]
    );

    res.status(201).json({ message: 'Libro insertado correctamente', result });
  } catch (error) {
    console.error('Error al insertar libro:', error);
    res.status(500).json({ error: 'Error al insertar libro' });
  }
});

// Actualizar libro existente sin cambiar la portada
router.put('/:id', async (req: Request, res: Response) => {
    const bookId = Number(req.params.id);
    const { title, author_id, page_count, status, start_date, end_date, rating } = req.body;
  
    try {
      // Obtener el libro actual para mantener la portada existente
      const [rows] = await db.execute('SELECT cover_image FROM book WHERE id = ?', [bookId]);
      const existing = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  
      // Actualiza solo los datos del libro, sin tocar la portada
      await db.execute(
        `UPDATE book SET 
          title = ?, 
          author_id = ?, 
          page_count = ?, 
          status = ?, 
          start_date = ?, 
          end_date = ?, 
          rating = ? 
        WHERE id = ?`,
        [
          title,
          author_id,
          page_count,
          status,
          start_date || null,
          end_date || null,
          rating || null,
          bookId
        ]
      );
  
      res.status(200).json({ message: 'Libro actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar libro:', error);
      res.status(500).json({ error: 'Error al actualizar libro' });
    }
  });
  

// Eliminar libro por ID
router.delete('/:id', async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  try {
    await db.execute('DELETE FROM book WHERE id = ?', [bookId]);
    res.status(200).json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ error: 'Error al eliminar libro' });
  }
});

export default router;
