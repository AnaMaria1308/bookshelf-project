-- Crear la base de datos (si no está creada)
-- CREATE DATABASE bookshelf;

-- Seleccionar la base de datos
USE bookshelf;

-- Borrar tablas si ya existen (orden correcto por claves foráneas)
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS author;
DROP TABLE IF EXISTS user;

-- Crear tabla de autores
CREATE TABLE author (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Crear tabla de usuarios
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Crear tabla de libros
CREATE TABLE book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    page_count INT CHECK (page_count > 0),
    status ENUM('pending', 'in progress', 'read') DEFAULT 'pending',
    start_date DATE NULL,
    end_date DATE NULL,
	cover_image VARCHAR(255) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    CHECK (end_date IS NULL OR start_date <= end_date),
    FOREIGN KEY (author_id) REFERENCES author(id) ON DELETE CASCADE
);

-- Crear tabla de reseñas
CREATE TABLE review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    date DATE DEFAULT (CURDATE()),
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

SELECT * FROM author;
SELECT * FROM user;
SELECT * from book;
SELECT * from review;