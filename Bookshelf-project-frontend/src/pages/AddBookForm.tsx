import {
    ChangeEvent,
    FormEvent,
    MouseEvent,
    useEffect,
    useState
  } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import styles from "../styles/addForm.module.scss";
  
  interface FormData {
    title: string;
    author: string;
    page_count: string;
    status: 'pending' | 'in progress' | 'read';
    start_date: string;
    end_date: string;
    rating: string;
    cover_image: File | null;
  }
  
  function AddBookForm() {
    const { id } = useParams(); // <-- detectar si estamos en modo edición
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState<FormData>({
      title: '',
      author: '',
      page_count: '',
      status: 'pending',
      start_date: '',
      end_date: '',
      rating: '',
      cover_image: null,
    });
  
    useEffect(() => {
      if (id) {
        // Modo edición: obtener datos del libro
        const fetchBook = async () => {
          try {
            const res = await fetch(`http://localhost:3000/books/${id}`);
            const data = await res.json();
            setFormData({
              title: data.title || '',
              author: data.author || '',
              page_count: data.page_count?.toString() || '',
              status: data.status || 'pending',
              start_date: data.start_date?.split('T')[0] || '',
              end_date: data.end_date?.split('T')[0] || '',
              rating: data.rating?.toString() || '',
              cover_image: null, // no podemos previsualizar la imagen actual
            });
          } catch (error) {
            console.error("Error fetching book:", error);
          }
        };
  
        fetchBook();
      }
    }, [id]);
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      
        let body: BodyInit;
        let headers: HeadersInit = {};
      
        if (id) {
          // Editar: enviar JSON
          body = JSON.stringify({
            title: formData.title,
            author: formData.author,
            page_count: formData.page_count,
            status: formData.status,
            start_date: formData.start_date,
            end_date: formData.end_date,
            rating: formData.rating
          });
          headers['Content-Type'] = 'application/json';
        } else {
          // Crear: enviar con FormData
          const formDataToSend = new FormData();
          formDataToSend.append("title", formData.title);
          formDataToSend.append("author", formData.author);
          formDataToSend.append("page_count", formData.page_count);
          formDataToSend.append("status", formData.status);
          if (formData.rating) formDataToSend.append("rating", formData.rating);
          if (formData.start_date) formDataToSend.append("start_date", formData.start_date);
          if (formData.end_date) formDataToSend.append("end_date", formData.end_date);
          if (formData.cover_image) formDataToSend.append("cover_image", formData.cover_image);
          body = formDataToSend;
        }
      
        try {
          const res = await fetch(
            id ? `http://localhost:3000/books/${id}` : "http://localhost:3000/books",
            {
              method: id ? "PUT" : "POST",
              headers,
              body
            }
          );
      
          if (!res.ok) throw new Error("Error al enviar el libro");
          navigate("/library");
        } catch (error) {
          console.error("Error al enviar libro:", error);
        }
      };
      
  
    const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
      setFormData({
        title: '',
        author: '',
        page_count: '',
        status: 'pending',
        start_date: '',
        end_date: '',
        rating: '',
        cover_image: null,
      });
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <div className={styles.bookForm}>
            <label>Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
  
            <label>Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
  
            <label>Page count</label>
            <input
              type="number"
              id="page_count"
              name="page_count"
              value={formData.page_count}
              onChange={handleChange}
            />
  
            <label>Status</label>
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
              <label>Cover Image</label>
              <input
                type="file"
                id="cover_image"
                name="cover_image"
                onChange={handleFileChange}
              />
            </>
          )}
  
            <div className={styles.buttons}>
              <button type="submit">{id ? 'Update Book' : 'Add Book'}</button>
              <button type="button" onClick={handleReset}>Clear</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
  export default AddBookForm;
  