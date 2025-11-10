// tests/api.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GET as getProductoById } from '../src/pages/api/productos/[id].js'; 

// Mockear la IP para evitar el error 'address is undefined' en Vitest
const mockClient = { address: '127.0.0.1' };
const PRODUCT_ID_EXISTS = 1;
const PRODUCT_ID_NOT_FOUND = 999999;

describe('API Integración: Productos por ID', () => {
    
    // Antes de cada prueba, aseguramos que la base de datos esté lista
    // (Asume que ya ejecutaste 'node seed.js')

    it('debe devolver un producto por ID y código 200', async () => {
        const response = await getProductoById({ 
            params: { id: PRODUCT_ID_EXISTS.toString() },
            client: mockClient // Pasamos el mockClient para evitar errores de Rate Limit
        });

        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('id', PRODUCT_ID_EXISTS);
        expect(data).toHaveProperty('nombre');
        expect(data).toHaveProperty('precio');
    });

    it('debe devolver 404 si el producto no existe', async () => {
        const response = await getProductoById({ 
            params: { id: PRODUCT_ID_NOT_FOUND.toString() },
            client: mockClient
        });

        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toHaveProperty('error', 'Producto no encontrado');
    });
});