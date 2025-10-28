import http from 'k6/http';
import { check, sleep } from 'k6';
// Ya no importamos 'randomItem'

// --- Configuración de la prueba ---
export const options = {
  vus: 10,
  duration: '30s',
};

// 👇 Asegúrate que esta sea tu URL de Render
const BASE_URL = 'https://server-k6.onrender.com';
// 🛒 👇 Tu arreglo
const productIDs = [
  '1',
  '5',
  '12',
  '25',
  '99', // El ID que falla a propósito (para probar 404)
];

// --- Script principal ---
export default function () {
  
  // --- Endpoint 1: Probar "Todos los productos" ---
  const res1 = http.get(`${BASE_URL}/productos`);
  check(res1, {
    'GET /productos respondió OK (200)': (r) => r.status === 200,
  });

  sleep(1);

  // --- Endpoint 2: Probar "Producto Específico" ---
  
  // 👇 ESTA ES LA LÍNEA QUE CAMBIAMOS
  const randomProductID = productIDs[Math.floor(Math.random() * productIDs.length)];
  
  const productURL = `${BASE_URL}/productos/${randomProductID}`;
  const res2 = http.get(productURL);

  // Pruebas para el endpoint 2
  check(res2, {
    [`GET /productos/${randomProductID} respondió OK (200)`]: (r) => r.status === 200,
    [`GET /productos/${randomProductID} respondió Not Found (404)`]: (r) => r.status === 404,
  });

  sleep(1);
}