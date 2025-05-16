import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/reviewList.module.scss";

interface Review {
  id: number;
  book_title: string;
  comment: string;
  created_at: string; // ISO date string
}

function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:3000/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Reviews</h1>
        <button
          className={styles.addReviewBtn}
          onClick={() => navigate("/reviews/new")}
        >
          Add Review
        </button>
      </div>

      <div className={styles.reviewList}>
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
                <h3 className={styles.bookTitle}>{review.book_title}</h3>
                <p className={styles.comment}>{review.comment}</p>
                <p className={styles.date}>
                    Created on: {new Date(review.created_at + "T00:00:00").toLocaleDateString()}
                </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewList;
