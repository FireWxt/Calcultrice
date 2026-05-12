const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const calculationHistory = [];
let nextCalculationId = 1;

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

app.get('/history', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  res.json(calculationHistory.slice(0, limit));
});

app.post('/calculate', (req, res) => {
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
  const calculation = {
    id: nextCalculationId++,
    operation,
    num1: parsedNum1,
    num2: parsedNum2,
    result: formattedResult,
    createdAt: new Date().toISOString(),
  };

  calculationHistory.unshift(calculation);

  res.json({
    result: formattedResult,
    operation,
    num1: parsedNum1,
    num2: parsedNum2,
    calculation,
  });
});

app.listen(PORT, () => {
  console.log(`Backend API en écoute sur http://0.0.0.0:${PORT}`);
});
