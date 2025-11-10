// stress-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Configuración de la prueba
export const options = {
  thresholds: {
    // 95% de las peticiones deben ser completadas en menos de 500ms
    http_req_duration: ['p(95)<500'],
    // 99% de las peticiones deben ser exitosas (código 200)
    checks: ['rate>0.99'],
  },
  scenarios: {
    default: {
      executor: 'ramping-vus', // Usas el executor para etapas
      startVUs: 0,
      // 💡 CAMBIA maxVUs a 5
      stages: [
        { duration: '10s', target: 5 }, // Rampa hasta 5 VUs en 10 segundos
        { duration: '20s', target: 5 }, // Mantén 5 VUs por 20 segundos
        { duration: '5s', target: 0 },  // Baja a 0 VUs
      ],
      gracefulRampDown: '0s', // No es necesaria la rampa de bajada para esta prueba
    },
  },
};

// 2. Función principal de la prueba
export default function () {
  // Simular la carga de la página inicial (que golpea la API de productos)
  const res = http.get('http://127.0.0.1:4321/api/productos?limit=10&offset=0');

  // Para ver qué código de estado falla
  console.log(`Status code for request: ${res.status}`);

  // Verificar que la respuesta fue exitosa y es JSON
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch (e) {
        return false;
      }
    },
  });

  // Espera un poco para simular el tiempo de lectura del usuario
  sleep(5); 
}