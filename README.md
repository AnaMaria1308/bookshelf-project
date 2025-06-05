# 📚 Personal Bookshelf Manager

Este proyecto permite gestionar una biblioteca personal con funcionalidades para registrar libros, autores, reseñas y usuarios.

## 🚀 Cómo ejecutar la aplicación

### 1. Clona el repositorio

git clone https://github.com/AnaMaria1308/bookshelf-project.git

### 2. Configura la base de datos MySQL
Crea una base de datos en MySQL

Importa el script de la base de datos

Crea un archivo .env en Bookshelf-project-backend/ con el siguiente contenido:

DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=bookshelf_db
PORT=3000

### 3. Ejecuta el backend
cd Bookshelf-project-backend

npm install

npm run dev

### 4. Ejecuta el frontend
cd ../Bookshelf-project-frontend

npm install

npm run dev

### Ya tendrías el proyecto listo para empezar.
