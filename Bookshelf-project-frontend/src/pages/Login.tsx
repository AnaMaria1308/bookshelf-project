import { useState, useEffect } from "react";
import styles from "../styles/auth.module.scss";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", res.data.user.id);
      navigate("/library");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div className={styles.authContainer}>
        <h2>You are already logged in</h2>
        <p>If you want, you can log out.</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p className={styles.error}>{error}</p>}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Log in</button>
        <div className={styles.switchLink}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </form>
    </div>
  );
}
