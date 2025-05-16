import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/library.module.scss";
import { FiFilter, FiX } from "react-icons/fi"

interface Book {
    id: number;
    title: string;
    author: string;
    page_count: number;
    status: string;
    start_date: string | null;
    end_date: string | null;
    rating: number | null;
    cover_image: string | null;
}

type SortOption = "title-asc" | "title-desc" | "date-recent" | "rating-desc" | "rating-asc";

function Library() {
    const [books, setBooks] = useState<Book[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>("title-asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        author: "",
        status: "",
        minRating: "",
        startDate: "",
        endDate: "",
        minPages: "",
        maxPages: ""
    });

    const navigate = useNavigate();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("http://localhost:3000/books")
            .then(res => res.json())
            .then(setBooks)
            .catch(err => console.error("Error fetching books:", err));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };
        if (showFilters) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showFilters]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value as SortOption);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const uniqueAuthors = [...new Set(books.map(book => book.author))];

    const filteredBooks = books.filter(book => {
        const {
            author, status, minRating, startDate, endDate, minPages, maxPages
        } = filters;
        const rating = book.rating ?? 0;
        const pages = book.page_count;
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
        return (
            (!author || book.author === author) &&
            (!status || book.status === status) &&
            (!minRating || rating >= parseFloat(minRating)) &&
            (!startDate || (book.start_date && book.start_date >= startDate)) &&
            (!endDate || (book.end_date && book.end_date <= endDate)) &&
            (!minPages || pages >= parseInt(minPages)) &&
            (!maxPages || pages <= parseInt(maxPages)) &&
            matchesSearch
        );
    });

    const sortedBooks = [...filteredBooks].sort((a, b) => {
        switch (sortOption) {
            case "title-asc": return a.title.localeCompare(b.title);
            case "title-desc": return b.title.localeCompare(a.title);
            case "date-recent": return (new Date(b.end_date || '').getTime() || 0) - (new Date(a.end_date || '').getTime() || 0);
            case "rating-desc": return (b.rating ?? 0) - (a.rating ?? 0);
            case "rating-asc": return (a.rating ?? 0) - (b.rating ?? 0);
            default: return 0;
        }
    });

    return (
        <div>
            <h1 className={styles.bookTitle}>My bookshelf</h1>

            <div className={styles.controls}>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select value={sortOption} onChange={handleSortChange} className={styles.sortSelect}>
                        <option value="title-asc">Title (A - Z)</option>
                        <option value="title-desc">Title (Z - A)</option>
                        <option value="date-recent">Date read</option>
                        <option value="rating-desc">Descending rating</option>
                        <option value="rating-asc">Ascending rating</option>
                    </select>
                    <button className={styles.filterButton} onClick={() => setShowFilters(true)}>
                        <FiFilter size={18} />
                        Filters
                    </button>
            </div>

            {showFilters && (
                <div className={styles.overlay}>
                    <div className={styles.filterPanel} ref={panelRef}>
                        <button className={styles.closeButton} onClick={() => setShowFilters(false)}>
                            <FiX size={22} />
                        </button>
                        <div className={styles.filterForm}>
                            <label>
                                Author:
                                <select name="author" value={filters.author} onChange={handleFilterChange}>
                                    <option value="">All</option>
                                    {uniqueAuthors.map(author => (
                                        <option key={author} value={author}>{author}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Status:
                                <select name="status" value={filters.status} onChange={handleFilterChange}>
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="in progress">In progress</option>
                                    <option value="read">Read</option>
                                </select>
                            </label>
                            <label>
                                Minimum rating:
                                <input type="number" name="minRating" value={filters.minRating} onChange={handleFilterChange} min={0} max={5} step={0.1} />
                            </label>
                            <label>
                                Start date:
                                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                            </label>
                            <label>
                                End date:
                                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                            </label>
                            <label>
                                Min pages:
                                <input type="number" name="minPages" value={filters.minPages} onChange={handleFilterChange} />
                            </label>
                            <label>
                                Max pages:
                                <input type="number" name="maxPages" value={filters.maxPages} onChange={handleFilterChange} />
                            </label>
                            <button type="button" onClick={() =>
                                setFilters({
                                    author: "",
                                    status: "",
                                    minRating: "",
                                    startDate: "",
                                    endDate: "",
                                    minPages: "",
                                    maxPages: ""
                                })
                            }>
                                Clean filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.bookGrid}>
                {sortedBooks.map((book) => (
                    <div
                        key={book.id}
                        className={styles.bookCard}
                        onClick={() => navigate(`/books/${book.id}`)}
                    >
                        {book.cover_image && (
                            <img
                                src={`http://localhost:3000/uploads/${book.cover_image}`}
                                alt={`Cover of ${book.title}`}
                                className={styles.cover}
                            />
                        )}
                        <h3>{book.title}</h3>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Status:</strong> {book.status}</p>
                        <p><strong>Rating:</strong> {book.rating ?? "N/A"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Library;
