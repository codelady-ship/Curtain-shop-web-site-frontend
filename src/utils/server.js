// server.js (Backend kodu)

const express = require('express');
const cors = require('cors');
const app = express();

// CORS-u aktivləşdiririk
app.use(cors());

// API endpoint
app.get('/api/products', (req, res) => {
  res.json({ message: 'Məhsullar uğurla gətirildi!' });
});

// Serveri 8080 portunda işə salırıq
app.listen(8080, () => {
  console.log('Backend serveri 8080 portunda işləyir');
});