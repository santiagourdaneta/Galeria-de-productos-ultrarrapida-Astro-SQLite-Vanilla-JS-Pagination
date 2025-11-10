// seed.js
import Database from 'better-sqlite3';

// Número de productos que queremos generar
const COUNT = 100000; 

// Conexión a la base de datos
const db = new Database('db/database.db'); 

// Función para generar un nombre de producto aleatorio
function generateProductName(index) {
    const types = ['Camiseta', 'Pantalón', 'Gorra', 'Zapatos', 'Sudadera', 'Reloj'];
    const colors = ['Azul', 'Rojo', 'Verde', 'Negro', 'Blanco', 'Gris'];
    const type = types[Math.floor(Math.random() * types.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `${type} Deportiva ${color} - #${index}`;
}

console.log(`Comenzando la generación e inserción de ${COUNT} productos...`);

const start = Date.now();

try {
    // 1. Preparar la consulta de inserción
    // Usamos '?' como marcador de posición para evitar inyecciones SQL
    const insert = db.prepare('INSERT INTO productos (nombre, precio, descripcion, busqueda_key) VALUES (?, ?, ?, ?)');

    // 2. Usar una Transacción: ¡La clave de la velocidad!
    // Esto agrupa todas las 100,000 inserciones en una sola operación de disco.
    const insertMany = db.transaction((products) => {
        for (const p of products) {
            // El 'busqueda_key' es la columna optimizada para búsquedas rápidas.
            insert.run(p.nombre, p.precio, p.descripcion, p.nombre.toLowerCase());
        }
    });

    // 3. Generar el array de productos en memoria
    const productsToInsert = [];
    for (let i = 1; i <= COUNT; i++) {
        const nombre = generateProductName(i);
        productsToInsert.push({
            nombre: nombre,
            // Precios aleatorios entre 10 y 500
            precio: parseFloat((Math.random() * 490 + 10).toFixed(2)), 
            descripcion: `Descripción detallada del producto #${i}.`,
        });
    }

    // 4. Ejecutar la transacción
    insertMany(productsToInsert);

    const end = Date.now();
    const duration = (end - start) / 1000;

    console.log(`✅ ¡Éxito! Se insertaron ${COUNT} productos.`);
    console.log(`⏱️ Tiempo total de inserción: ${duration.toFixed(3)} segundos.`);

} catch (error) {
    console.error("❌ Error durante la inserción:", error);
} finally {
    db.close();
}