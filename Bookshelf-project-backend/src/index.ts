import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//Importación de rutas
import bookRoutes from './routes/books';
import reviewRoutes from './routes/reviews';
import authRoutes from './routes/auth';
import authorRoutes from './routes/authors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/auth", authRoutes);
app.use("/authors", authorRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

