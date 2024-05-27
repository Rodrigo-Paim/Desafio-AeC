const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'addressdb',
  password: 'password',
  port: 5432,
});

const SECRET_KEY = 'your_secret_key';

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rota de Registro
app.post('/register', async (req, res) => {
  const { name, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (name, username, password) VALUES ($1, $2, $3)', [name, username, hashedPassword]);
  res.sendStatus(201);
});

// Rota de Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (user.rows.length > 0) {
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (validPassword) {
      const token = jwt.sign({ id: user.rows[0].id, username }, SECRET_KEY);
      res.json({ token });
    } else {
      res.status(400).send('Senha inválida');
    }
  } else {
    res.status(400).send('Usuário não encontrado');
  }
});

// Rota para criar endereço
app.post('/address', authenticateToken, async (req, res) => {
  const { cep, logradouro, complemento, bairro, cidade, uf, numero } = req.body;
  await pool.query('INSERT INTO addresses (user_id, cep, logradouro, complemento, bairro, cidade, uf, numero) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
                   [req.user.id, cep, logradouro, complemento, bairro, cidade, uf, numero]);
  res.sendStatus(201);
});

// Rota para obter endereços
app.get('/addresses', authenticateToken, async (req, res) => {
  const addresses = await pool.query('SELECT * FROM addresses WHERE user_id = $1', [req.user.id]);
  res.json(addresses.rows);
});

// Rota para editar endereço
app.put('/address/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { cep, logradouro, complemento, bairro, cidade, uf, numero } = req.body;
  await pool.query('UPDATE addresses SET cep = $1, logradouro = $2, complemento = $3, bairro = $4, cidade = $5, uf = $6, numero = $7 WHERE id = $8 AND user_id = $9', 
                   [cep, logradouro, complemento, bairro, cidade, uf, numero, id, req.user.id]);
  res.sendStatus(200);
});

// Rota para deletar endereço
app.delete('/address/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [id, req.user.id]);
  res.sendStatus(200);
});

// Rota para buscar endereço por CEP
app.get('/viacep/:cep', async (req, res) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${req.params.cep}/json/`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Erro ao buscar o CEP');
  }
});

// Rota para exportar endereços para CSV
app.get('/export/csv', authenticateToken, async (req, res) => {
  const addresses = await pool.query('SELECT * FROM addresses WHERE user_id = $1', [req.user.id]);
  const csvData = addresses.rows.map(row => `${row.cep},${row.logradouro},${row.complemento},${row.bairro},${row.cidade},${row.uf},${row.numero}`).join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('addresses.csv');
  res.send(csvData);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
