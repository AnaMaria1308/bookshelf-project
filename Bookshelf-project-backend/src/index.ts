import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/books';
import reviewRoutes from './routes/reviews'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/books', bookRoutes);

app.use('/reviews', reviewRoutes);

app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

