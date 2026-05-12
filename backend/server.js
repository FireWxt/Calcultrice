const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.get('/health', (req, res) => {
  res.json({ status: 'Backend OK' });
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
});(req, res) => {
  const { operation, num1, num2 } = req.body;
pp.listen(PORT, () => {
  console.log(`Backend API en écoute sur http://0.0.0.0:${PORT}`);
}
  const formattedResult = formatNumber(resultValue);

  res.json({
    result: formattedResult,
    operation,
    num1: parsedNum1,
    num2: parsedNum2,
  });