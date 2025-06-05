import { useState } from "react";
import styles from "../styles/auth.module.scss";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:3000/auth/register", {
        username,
        email,
        password,
      });
      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Try again.");
      setSuccess(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>User registered!</p>}

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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

        <button type="submit">Register</button>
        <div className={styles.switchLink}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
