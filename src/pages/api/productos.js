// src/pages/api/productos.js
import Database from 'better-sqlite3';
import NodeCache from 'node-cache'; 

// --- ⚙️ CONFIGURACIÓN DE CACHÉ ---
// stdTTL: 600 segundos = 10 minutos de vida.
const myCache = new NodeCache({ stdTTL: 600 }); 
const db = new Database('db/database.db', { readonly: true });
const ALL_PRODUCTS_CACHE_KEY = 'all_products_limit_100'; 

// --- 🛡️ CONFIGURACIÓN DEL RATE LIMITING (Límite de Tasa) ---
const rateLimitCache = new NodeCache({ stdTTL: 60 }); // Ventana de 60 segundos
const MAX_REQUESTS = 30; // 30 peticiones por minuto por IP

/**
 * 🛡️ Verifica el Rate Limiting.
 * @param {string} ip - La dirección IP del cliente.
 */
function checkRateLimit(ip) {
    const key = `rate_limit_${ip}`;
    let count = rateLimitCache.get(key) || 0; 
    
    if (count >= MAX_REQUESTS) {
        return false; 
    }

    rateLimitCache.set(key, count + 1);
    return true; 
}


export async function GET({ url, client }) {
  
  // 1. 🛡️ VERIFICACIÓN DEL RATE LIMITING/DDOS
  // Usamos un valor por defecto si 'client.address' es undefined
  const ip = client?.address || 'local-dev-ip'; 
  
  if (!checkRateLimit(ip)) {
    return new Response(
        JSON.stringify({ error: "Demasiadas peticiones (Rate Limit). Intenta en un momento." }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. ⚙️ OBTENER PARÁMETROS DE CONSULTA Y PAGINACIÓN
  const search = url.searchParams.get('q') || '';
  const limit = parseInt(url.searchParams.get('limit')) || 10;
  const offset = parseInt(url.searchParams.get('offset')) || 0;

  // 3. LÓGICA PRINCIPAL (BÚSQUEDA O CARGA PAGINADA)

  // Si hay búsqueda O la petición es para una página diferente a la primera (offset > 0),
  // NO usamos el caché; vamos directo a la base de datos.
  if (search || offset > 0) {
    try {
        // 🔒 Protección: Usando '?' y pasando parámetros separados (SQL Injection).
        let query = `SELECT id, nombre, precio FROM productos`;
        let params = [];

        if (search) {
            query += ` WHERE busqueda_key LIKE ?`;
            params.push('%' + search.toLowerCase() + '%');
        }

        // Aplicamos el LIMIT y OFFSET al final para la paginación.
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        
        const productos = db.prepare(query).all(params);

        return new Response(
            JSON.stringify(productos),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
         console.error("Error en la consulta:", error);
         return new Response(
            JSON.stringify({ error: "Error en la consulta." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
  }

  // 4. 💾 LÓGICA DE CARGA INICIAL (Solo en la página 1, sin búsqueda)
  
  // 🚀 Revisar el Caché (Cache HIT)
  let productos = myCache.get(ALL_PRODUCTS_CACHE_KEY);
  if (productos) {
    // console.log("CACHE HIT! Sirviendo productos desde la memoria.");
    // Devolvemos solo el límite que el frontend espera (10)
    return new Response(
        JSON.stringify(productos.slice(0, limit)), 
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 🐌 Cache MISS! Ir a la Base de Datos
  try {
    // console.log("CACHE MISS! Consultando la Base de Datos.");
    
    // Traemos un conjunto más grande para guardar en caché
    const query = 'SELECT id, nombre, precio FROM productos LIMIT 100'; 
    productos = db.prepare(query).all();

    // 💾 Guardar el conjunto en el Caché
    myCache.set(ALL_PRODUCTS_CACHE_KEY, productos);

    // Devolvemos solo el límite inicial (10) al cliente
    return new Response(
        JSON.stringify(productos.slice(0, limit)),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error al obtener productos:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}