CREATE DATABASE addressdb;

\c addressdb

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  cep VARCHAR(10) NOT NULL,
  logradouro VARCHAR(100),
  complemento VARCHAR(100),
  bairro VARCHAR(50),
  cidade VARCHAR(50),
  uf VARCHAR(2),
  numero VARCHAR(10)
);
