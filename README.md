# 🚀 Galería de Productos con Paginación Instantánea

Este proyecto demuestra cómo construir una galería de productos de alto rendimiento utilizando **Astro** para el Server-Side Rendering (SSR) y una base de datos **SQLite** para la gestión de datos. El objetivo principal es lograr una experiencia de usuario rápida y ligera, con paginación y búsqueda instantánea impulsada por **Vanilla JavaScript**.

Ideal para proyectos que priorizan la velocidad y la compatibilidad con dispositivos antiguos.

## Características Clave

* **Server-Side Rendering (SSR):** La primera página de productos se carga con todos los datos incrustados en el HTML, garantizando un tiempo de carga (LCP) excelente.
* **Base de Datos SQLite:** Uso de `better-sqlite3` en el lado del servidor (Astro) para un acceso a datos rápido y ligero.
* **Paginación Eficiente:** La lógica de paginación se maneja mediante llamadas `fetch` asíncronas, cargando solo el subconjunto de datos necesario (10 ítems por página).
* **Delegación de Eventos:** Uso de delegación de eventos en Vanilla JS para manejar los clics en los botones de detalle y paginación, asegurando que los elementos cargados dinámicamente funcionen correctamente.
* **Búsqueda Instantánea:** Filtrado de productos en tiempo real con optimizaciones de consulta SQL.
* **Estilo Minimalista:** Utiliza [Pico.css](https://picocss.com/) para un diseño limpio y accesible sin dependencias pesadas.

## 🛠️ Estructura del Proyecto

El código se divide en dos partes principales:

1.  **Bloque SSR (Astro):** Carga la configuración inicial, conecta a SQLite, obtiene el total de productos y renderiza los primeros 10 productos directamente en el HTML.
2.  **Bloque Cliente (JavaScript):** Controla el estado (`currentPage`, `isSearching`), maneja las funciones `fetchProducts` y `renderProducts`, y adjunta los *event listeners* para la paginación y la búsqueda.

## ⚙️ Configuración y Ejecución

### Requisitos

* Node.js (versión 18+)
* Una base de datos SQLite (el proyecto asume `db/database.db`)

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/santiagourdaneta/Galeria-de-productos-ultrarrapida-Astro-SQLite-Vanilla-JS-Pagination]
    cd Galeria-de-productos-ultrarrapida-Astro-SQLite-Vanilla-JS-Pagination
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
    *(Asegúrate de tener la base de datos `database.db` en la carpeta `db/` con la tabla `productos`.)*

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

Abre tu navegador en `http://localhost:4321` y experimenta la velocidad de carga de la galería.

## 🔗 APIs Utilizadas

* **`/api/productos`:** Endpoint que maneja la lógica de paginación y búsqueda (SQLite).
* **`/api/productos/[id]`:** Endpoint para obtener detalles de un producto específico (usado para el modal).

astro, sqlite, vanillajs, ssr, webperf, pagination, javascript, pico-css
#AstroJS #SSR #SQLite #WebPerformance #VanillaJS #PicoCSS #FastWeb