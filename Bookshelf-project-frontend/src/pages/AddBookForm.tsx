import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/addForm.module.scss";
import api from "../api";

interface FormData {
  title: string;
  author: string;
  page_count: string;
  status: "pending" | "in progress" | "read";
  start_date: string;
  end_date: string;
  rating: string;
  cover_image: File | null;
}

interface Author {
  id: number;
  name: string;
}

function AddBookForm() {
  const { id } = useParams(); // <-- detectar si estamos en modo edición
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    page_count: "",
    status: "pending",
    start_date: "",
    end_date: "",
    rating: "",
    cover_image: null,
  });
  const [authors, setAuthors] = useState<Author[]>([]);
  const [originalData, setOriginalData] = useState<FormData | null>(null);

  const hasChanges = (): boolean => {
    if (!originalData) return true;

    return (
      formData.title !== originalData.title ||
      formData.author !== originalData.author ||
      formData.page_count !== originalData.page_count ||
      formData.status !== originalData.status ||
      formData.start_date !== originalData.start_date ||
      formData.end_date !== originalData.end_date ||
      formData.rating !== originalData.rating
    );
  };

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          const res = await api.get(`/books/${id}`);
          const data = await res.data;

          const bookData: FormData = {
            title: data.title || "",
            author: data.author_id?.toString() || "",
            page_count: data.page_count?.toString() || "",
            status: data.status || "pending",
            start_date: data.start_date?.split("T")[0] || "",
            end_date: data.end_date?.split("T")[0] || "",
            rating: data.rating?.toString() || "",
            cover_image: null,
          };

          setFormData(bookData);
          setOriginalData(bookData);
        } catch (error) {
          console.error("Error fetching book:", error);
        }
      };

      fetchBook();
    }
  }, [id]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await api.get("/authors");
        setAuthors(res.data);
      } catch (error) {
        console.error("Error fetching authors: ", error);
      }
    };

    fetchAuthors();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({
      ...prevData,
      cover_image: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (id) {
        // Editar libro (no se envía imagen)
        const bookData = {
          title: formData.title,
          author_id: Number(formData.author),
          page_count: formData.page_count,
          status: formData.status,
          start_date: formData.start_date,
          end_date: formData.end_date,
          rating: formData.rating,
        };
        console.log("Book data to update:", bookData);

        await api.put(`/books/${id}`, bookData);
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("author_id", formData.author);
        formDataToSend.append("page_count", formData.page_count);
        formDataToSend.append("status", formData.status);
        if (formData.rating) formDataToSend.append("rating", formData.rating);
        if (formData.start_date)
          formDataToSend.append("start_date", formData.start_date);
        if (formData.end_date)
          formDataToSend.append("end_date", formData.end_date);
        if (formData.cover_image)
          formDataToSend.append("cover_image", formData.cover_image);

        await api.post("/books", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      navigate("/library");
    } catch (error) {
      console.error("Error al enviar libro:", error);
    }
  };

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    setFormData({
      title: "",
      author: "",
      page_count: "",
      status: "pending",
      start_date: "",
      end_date: "",
      rating: "",
      cover_image: null,
    });
  };

  const isFormValid =
    formData.title.trim() !== "" &&
    formData.author !== "" &&
    formData.page_count.trim() !== "" &&
    (!id ? formData.cover_image !== null : true) &&
    (id ? hasChanges() : true);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.bookForm}>
          <label>
            Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <label>
            Author <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            options={authors.map((a) => ({
              value: a.id.toString(),
              label: a.name,
            }))}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                author: selected?.value || "",
              }))
            }
            value={
              authors.length
                ? {
                    value: formData.author,
                    label: authors.find((a) => a.id === Number(formData.author))
                      ?.name,
                  }
                : null
            }
            isClearable
            placeholder="Select an author..."
          />
          <label>
            Page count <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            id="page_count"
            name="page_count"
            value={formData.page_count}
            onChange={handleChange}
          />

          <label>
            Status <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In progress</option>
            <option value="read">Read</option>
          </select>

          <label>Start date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />

          <label>End date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />

          <label>Rating</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
          />

          {!id && (
            <>
              <label>
                Cover Image <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="file"
                id="cover_image"
                name="cover_image"
                onChange={handleFileChange}
              />
            </>
          )}

          <div className={styles.buttons}>
            <button type="submit" disabled={!isFormValid}>
              {id ? "Update Book" : "Add Book"}
            </button>
            <button type="button" onClick={handleReset}>
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddBookForm;
