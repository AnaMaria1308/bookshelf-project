import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/reviewList.module.scss";
import api from "../api";

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
      const res = await api.get("http://localhost:3000/reviews");
      setReviews(res.data);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
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
                Created on:{" "}
                {new Date(review.created_at + "T00:00:00").toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewList;
