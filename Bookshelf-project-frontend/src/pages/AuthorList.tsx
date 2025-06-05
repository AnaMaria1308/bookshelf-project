import { useState, useEffect } from "react";
import styles from "../styles/auth.module.scss";
import api from "../api";

export default function AuthorList() {
  const [authors, setAuthors] = useState<{ id: number; name: string }[]>([]);
  const [newAuthor, setNewAuthor] = useState("");

  const fetchAuthors = async () => {
    const res = await api.get("http://localhost:3000/authors");
    setAuthors(res.data);
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("http://localhost:3000/authors", { name: newAuthor });
    setNewAuthor("");
    fetchAuthors();
  };

  const handleDeleteAuthor = async (id: number) => {
    await api.delete(`http://localhost:3000/authors/${id}`);
    fetchAuthors();
  };

  return (
    <div className={styles.authorListContainer}>
      <h2>Authors</h2>
      <form onSubmit={handleAddAuthor}>
        <input
          type="text"
          placeholder="New author name"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            {author.name}
            <button onClick={() => handleDeleteAuthor(author.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
