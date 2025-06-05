import styles from "../styles/home.module.scss";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <h1>Welcome to your reading space</h1>
      <p>What would you like to do today?</p>

      <div className={styles.actions}>
        <button onClick={() => navigate("/library")}>
          📚 View your library
        </button>
        <button onClick={() => navigate("/addBook")}>➕ Add a new book</button>
        <button onClick={() => navigate("/reviews")}>
          📝 See your reviews
        </button>
      </div>

      <div className={styles.quote}>
        <p>
          <em>
            "A reader lives a thousand lives before he dies. The man who never
            reads lives only one."
          </em>{" "}
          – George R.R. Martin
        </p>
      </div>

      <h2 className={styles.subheading}>Featured Books</h2>
      <div className={styles.imgContainer}>
        <div className={styles.bookCard}>
          <img src="src/assets/images/normal-people.jpg" alt="Normal People" />
          <span>Normal People</span>
        </div>
        <div className={styles.bookCard}>
          <img src="src/assets/images/binding-13.jpg" alt="Binding 13" />
          <span>Binding 13</span>
        </div>
        <div className={styles.bookCard}>
          <img
            src="src/assets/images/the-love-hypothesis.jpg"
            alt="The Love Hypothesis"
          />
          <span>The Love Hypothesis</span>
        </div>
        <div className={styles.bookCard}>
          <img
            src="src/assets/images/it-ends-with-us.jpg"
            alt="It Ends With Us"
          />
          <span>It Ends With Us</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
