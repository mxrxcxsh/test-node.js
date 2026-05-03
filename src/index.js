// // import { value } from './value.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';

// // const message = 'Hello world of mine';

// // console.log(message, '\n', value);

// // console.log(import.meta);

// const postsPrath = path.join(import.meta.dirname, '..', 'posts.json');
const productsPath = path.join(import.meta.dirname, '..', 'products.json');
const carsPath = path.join(import.meta.dirname, '..', 'cars.json');

// // fs.readFile(postsPrath, 'utf-8', (err, data) => {
// //   if (err) {
// //     console.error('Error reading file:', err);
// //     return;
// //   }
// //   console.log(data);
// // });

const dataProducts = await fs.readFile(productsPath, { encoding: 'utf-8' });
const data = await fs.readFile(carsPath, { encoding: 'utf-8' });
const products = JSON.parse(dataProducts);
const cars = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  const { method, url } = req;

  if (method === 'GET' && url === '/products') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(products));
  }
  if (method === 'GET' && url.startsWith('/products/')) {
    const productId = url.split('/')[2];
    console.log(productId);
    console.log(Array.isArray(products));
    const product = products.products.find((p) => String(p.id) === productId);

    if (!product) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ message: 'Product not found' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(product));
  }
  if (method === 'GET' && url === '/cars') {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    return res.end(JSON.stringify(cars));
  }

  // /cars/1  /cars/2 /cars/3
  if (method === 'GET' && url.startsWith('/cars/')) {
    const carId = url.split('/')[2];
    const car = cars.find((c) => c.id === carId);

    if (!car) {
      res.statusCode = 404;
      res.setHeader('Content-type', 'application/json');
      return res.end(JSON.stringify({ message: 'Car not found' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    return res.end(JSON.stringify(car));
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
