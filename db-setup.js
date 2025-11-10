// db-setup.js
import Database from 'better-sqlite3';

// Conecta o crea el archivo database.db
const db = new Database('db/database.db'); 

// Crea la tabla de productos (el estante para los productos)
db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        descripcion TEXT,
        -- Campo para optimizar la búsqueda
        busqueda_key TEXT
    );
`);

console.log("Base de datos y tabla 'productos' creadas con éxito.");
db.close();