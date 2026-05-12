const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Route pour la calculatrice API
app.post('/calculate', (req, res) => {
  const { operation, num1, num2 } = req.body;

  let result;
  switch (operation) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      result = num1 - num2;
      break;
    case '*':
      result = num1 * num2;
      break;
    case '/':
      if (num2 === 0) {
        return res.status(400).json({ error: 'Division par zéro impossible' });
      }
      result = num1 / num2;
      break;
    default:
      return res.status(400).json({ error: 'Opération invalide' });
  }

  res.json({ result });
});

// Servir le fichier HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Calculatrice en écoute sur http://localhost:${PORT}`);
});
