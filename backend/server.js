const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;
const calculationHistory = [];
let nextCalculationId = 1;

client.collectDefaultMetrics({ prefix: 'calculatrice_' });

const httpRequestsTotal = new client.Counter({
  name: 'calculatrice_http_requests_total',
  help: 'Total number of HTTP requests received by the backend',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'calculatrice_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.path === '/metrics') {
    return next();
  }

  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const route = req.route?.path || req.path;
    const statusCode = String(res.statusCode);
    const durationSeconds = Number(process.hrtime.bigint() - startTime) / 1e9;

    httpRequestsTotal.inc({ method: req.method, route, status_code: statusCode });
    httpRequestDurationSeconds.observe(
      { method: req.method, route, status_code: statusCode },
      durationSeconds,
    );
  });

  next();
});

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

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend API en écoute sur http://0.0.0.0:${PORT}`);
  });
}

module.exports = {
  app,
  computeResult,
  formatNumber,
};
