// URL de l'API backend
const API_URL = 'https://calcultrice.onrender.com';

async function calculate() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const operation = document.getElementById('operation').value;
    const errorDiv = document.getElementById('error');
    const resultSection = document.getElementById('result-section');

    // Réinitialiser le message d'erreur
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');

    // Validation des inputs
    if (isNaN(num1) || isNaN(num2)) {
        errorDiv.textContent = 'Veuillez entrer deux nombres valides';
        errorDiv.classList.add('show');
        resultSection.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation,
                num1,
                num2
            })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.error;
            errorDiv.classList.add('show');
            resultSection.style.display = 'none';
            return;
        }

        // Afficher le résultat
        const result = data.result;
        document.getElementById('result').textContent = 
            Number.isInteger(result) ? result : result.toFixed(4);
        resultSection.style.display = 'block';

    } catch (error) {
        console.error('Erreur:', error);
        errorDiv.textContent = 'Erreur de communication avec le serveur (' + error.message + ')';
        errorDiv.classList.add('show');
        resultSection.style.display = 'none';
    }
}

// Permettre de calculer en appuyant sur Entrée
document.getElementById('num2').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calculate();
    }
});

// Vérifier la connexion au backend au chargement
window.addEventListener('load', function() {
    fetch(`${API_URL}/health`)
        .then(response => response.json())
        .then(data => console.log('Backend connecté:', data))
        .catch(error => console.warn('Impossible de connecter au backend:', error.message));
});
