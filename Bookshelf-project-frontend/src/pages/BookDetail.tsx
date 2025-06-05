import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/bookDetail.module.scss";
import api from "../api";

interface Book {
  id: number;
  title: string;
  author: string;
  page_count: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  rating: number | null;
  cover_image: string | null;
}

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`http://localhost:3000/books/${id}`);
        const data = await res.data;
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/books/${id}`);
      navigate("/library");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("❌ Failed to delete book");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-EN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!book) return <p>Loading book...</p>;

  return (
    <div className={styles.bookDetail}>
      {book.cover_image && (
        <img
          src={`http://localhost:3000/uploads/${book.cover_image}`}
          alt={`Cover of ${book.title}`}
          className={styles.coverLarge}
        />
      )}
      <h2>{book.title}</h2>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Status:</strong> {book.status}
      </p>
      <p>
        <strong>Pages:</strong> {book.page_count}
      </p>
      {book.rating && (
        <p>
          <strong>Rating:</strong> {book.rating}/5
        </p>
      )}
      {book.start_date && (
        <p>
          <strong>Started:</strong> {formatDate(book.start_date)}
        </p>
      )}
      {book.end_date && (
        <p>
          <strong>Finished:</strong> {formatDate(book.end_date)}
        </p>
      )}
      <div className={styles.buttonGroup}>
        <button onClick={handleDelete} className={styles.deleteButton}>
          🗑️ Delete Book
        </button>
        <button
          onClick={() => navigate(`/editBook/${book.id}`)}
          className={styles.editButton}
        >
          ✏️ Edit Book
        </button>
      </div>
    </div>
  );
}

export default BookDetail;
