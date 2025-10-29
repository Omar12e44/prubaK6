import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'https://server-k6.onrender.com'; 

const productIDs = [
  '1',
  '5',
  '12',
  '25',
  '99', 
];

// --- Script principal ---
export default function () {
  const resIndex = http.get(`${BASE_URL}/`);
  check(resIndex, {
    'GET / (Index) respondió OK (200)': (r) => r.status === 200,
    'GET / (Index) contiene HTML de bienvenida': (r) => r.body.includes("¡Bienvenido a la API de Productos!"),
  });

  sleep(1); 

  
  const res1 = http.get(`${BASE_URL}/productos`);
  check(res1, {
    'GET /productos respondió OK (200)': (r) => r.status === 200,
  });

  sleep(1); 

  

  const randomProductID = productIDs[Math.floor(Math.random() * productIDs.length)];
  
  const productURL = `${BASE_URL}/productos/${randomProductID}`;
  const res2 = http.get(productURL);


  check(res2, {
    [`GET /productos/${randomProductID} respondió OK (200)`]: (r) => r.status === 200,
    [`GET /productos/${randomProductID} respondió Not Found (404)`]: (r) => r.status === 404,
  });

  sleep(1); 
}
