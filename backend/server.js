const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://calculatrice:calculatrice@localhost:5432/calculatrice',
});

app.use(cors());
app.use(express.json());

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculations (
      id SERIAL PRIMARY KEY,
      operation TEXT NOT NULL,
      num1 DOUBLE PRECISION NOT NULL,
      num2 DOUBLE PRECISION NOT NULL,
      result DOUBLE PRECISION NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function formatNumber(value) {
  return Number.isInteger(value) ? value : parseFloat(value.toFixed(4));
}

function computeResult(operation, num1, num2) {
  switch (operation) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      if (num2 === 0) {
        return null;
      }
      return num1 / num2;
    default:
      return undefined;
  }
}

function toHistoryRow(row) {
  return {
    id: row.id,
    operation: row.operation,
    num1: Number(row.num1),
    num2: Number(row.num2),
    result: Number(row.result),
    createdAt: row.created_at,
  };
}

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'Backend OK' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'Backend DB unavailable' });
  }
});

app.get('/history', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  try {
    const result = await pool.query(
      'SELECT id, operation, num1, num2, result, created_at FROM calculations ORDER BY created_at DESC LIMIT $1',
      [limit]
    );

    res.json(result.rows.map(toHistoryRow));
  } catch (error) {
    console.error('Error loading history:', error);
    res.status(500).json({ error: 'Impossible de charger l\'historique' });
  }
});

app.post('/calculate', async (req, res) => {
  const { operation, num1, num2 } = req.body;

  const parsedNum1 = Number(num1);
  const parsedNum2 = Number(num2);
  const resultValue = computeResult(operation, parsedNum1, parsedNum2);

  if (resultValue === undefined) {
    return res.status(400).json({ error: 'Opération invalide' });
  }

  if (resultValue === null) {
    return res.status(400).json({ error: 'Division par zéro impossible' });
  }

  const formattedResult = formatNumber(resultValue);

  try {
    const savedCalculation = await pool.query(
      `INSERT INTO calculations (operation, num1, num2, result)
       VALUES ($1, $2, $3, $4)
       RETURNING id, operation, num1, num2, result, created_at`,
      [operation, parsedNum1, parsedNum2, formattedResult]
    );

    res.json({
      result: formattedResult,
      calculation: toHistoryRow(savedCalculation.rows[0]),
    });
  } catch (error) {
    console.error('Error saving calculation:', error);
    res.status(500).json({ error: 'Impossible de sauvegarder le calcul' });
  }
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Backend API en écoute sur http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

startServer();