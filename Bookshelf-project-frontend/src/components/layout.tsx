import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

import styles from "./styles/layout.module.scss";

export default function Layout() {
  return (
    <div>
      <div className={styles.navigationBar}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src="src/assets/images/logo-2.png" alt="Bookshelf Logo" />
          </Link>
        </div>
        <nav className={styles.navLinks}>
          <span>
            <Link to="/library">Library</Link>
          </span>
          <span>
            <Link to="/addBook">Add book</Link>
          </span>
          <span>
            <Link to="/reviews">Reviews</Link>
          </span>
          <span>
            <Link to="/authors">Authors</Link>
          </span>
          <span>
            <Link to="/login">Login</Link>
          </span>
          <span>
            <Link to="/register">Register</Link>
          </span>
        </nav>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
