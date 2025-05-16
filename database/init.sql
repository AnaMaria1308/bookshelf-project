-- CREATE DATABASE bookshelf;

USE bookshelf;

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    page_count INT CHECK (page_count > 0),
    status ENUM('pending', 'in progress', 'read') DEFAULT 'pending',
    start_date DATE NULL,
    end_date DATE NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    cover_image VARCHAR(255) NOT NULL,
    CONSTRAINT chk_dates CHECK (end_date IS NULL OR start_date <= end_date)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    comment TEXT NOT NULL,
    date DATE DEFAULT (CURDATE()),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

SELECT * FROM reviews;



