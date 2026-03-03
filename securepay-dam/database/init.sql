-- Inicialización mínima para la base de datos SecurePay
CREATE DATABASE securepay;
\connect securepay

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);

CREATE TABLE transfers (
  id SERIAL PRIMARY KEY,
  from_account TEXT NOT NULL,
  to_account TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HARDENING: Crear usuario con privilegios mínimos
CREATE USER securepay_app WITH PASSWORD 'AppPassword456';

-- Dar permiso de conexión
GRANT CONNECT ON DATABASE securepay TO securepay_app;

-- Solo permitir INSERT y SELECT, denegar UPDATE y DROP
GRANT SELECT, INSERT ON TABLE transfers TO securepay_app;
GRANT USAGE, SELECT ON SEQUENCE transfers_id_seq TO securepay_app;
