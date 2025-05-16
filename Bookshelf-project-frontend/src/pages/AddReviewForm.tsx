import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/reviewList.module.scss";

interface Book {
  id: number;
  title: string;
  author: string;
}

export default function AddReviewForm() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then(setBooks)
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBookId) {
      alert("Please select a book");
      return;
    }
    if (!comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: selectedBookId,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to create review");

      navigate("/reviews");
    } catch (error) {
      console.error(error);
      alert("Error saving the review");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Review</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Book:
          <select
            className={styles.select}
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Select a book
            </option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.author})
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Review:
          <textarea
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={8}
            placeholder="Write your review here..."
            required
          />
        </label>

        <div className={styles.buttons}>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate("/reviews")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
