const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// ==============================
// Variável Global para a conexão
// ==============================
let connection = null;

/* ============================================================
                    ROTAS CRUD (ANTES DO startServer)
   ============================================================ */

// ROTA 1: LISTAR USUÁRIOS (READ)
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

// ROTA 2: CRIAR USUÁRIO (CREATE)
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  try {
    await connection.query(
      'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
      [nome, email]
    );
    res.status(201).send('Usuário criado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar usuário');
  }
});

// ROTA 3: DELETAR USUÁRIO (DELETE)
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.send('Usuário apagado!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao apagar');
  }
});

/* ============================================================
                    INICIAR SERVIDOR
   ============================================================ */

const startServer = async () => {
  try {
    // Guardamos a conexão na variável global para usar nas rotas
    connection = await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar:', error);
    process.exit(1);
  }
};

startServer();
