const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


let products = [
  {
     id: 1, name: "Laptop", price: 55000 
    },
  {
     id: 2, name: "Mouse", price: 500
     }
];


app.get('/api/products', (req, res) => {
  res.json(products);
});


app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});


app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});


app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { name, price } = req.body;
  if (name) product.name = name;
  if (price) product.price = price;

  res.json(product);
});


app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000`);
});