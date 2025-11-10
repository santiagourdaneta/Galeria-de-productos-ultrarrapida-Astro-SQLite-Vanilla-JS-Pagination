// src/pages/api/productos/[id].js
import Database from 'better-sqlite3';

const db = new Database('db/database.db', { readonly: true });

// La función GET recibe un objeto 'params' que contiene el 'id'
export async function GET({ params }) {
    const productId = params.id;
    
    if (!productId) {
        return new Response(JSON.stringify({ error: "Falta el ID del producto" }), { status: 400 });
    }

    try {
        // 🔒 Protección contra SQL Injection: Usando ? para el ID.
        const query = 'SELECT * FROM productos WHERE id = ?';
        
        // Ejecutamos la consulta para encontrar un solo producto
        const producto = db.prepare(query).get(productId);

        if (!producto) {
            return new Response(JSON.stringify({ error: "Producto no encontrado" }), { status: 404 });
        }

        // Devolvemos toda la información del producto
        return new Response(
            JSON.stringify(producto),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error("Error al buscar producto por ID:", error);
        return new Response(
            JSON.stringify({ error: "Error interno del servidor" }),
            { status: 500 }
        );
    }
}