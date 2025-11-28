import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { testConnection, query } from './database/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

// Configuration CORS pour permettre les requêtes depuis le frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Middleware pour parser le JSON
app.use(express.json());

// Test de connexion à la base de données au démarrage
testConnection().catch((error) => {
  console.error('Failed to connect to database:', error);
});

app.get('/', (req, res) => {
  res.status(200).send('hello');
});

app.get('/task', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/task', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await query(
      'INSERT INTO tasks (title, description, status, priority) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description || null, status || 'todo', priority || 'normal']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
