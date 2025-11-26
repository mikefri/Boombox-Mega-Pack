// script.js
const API_KEY = 'VOTRE_CLE_API_ICI'; // <-- REMPLACEZ PAR VOTRE VRAIE CLÉ
const CITY_NAME = 'Paris'; // <-- Changez pour votre ville par défaut

async function fetchWeather() {
    // 1. Appel API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=metric&lang=fr&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur de l\'API météo');
        }
        const data = await response.json();

        // 2. Mise à jour du HTML
        document.getElementById('location').textContent = data.name;
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        // La première lettre en majuscule pour la description
        const description = data.weather[0].description;
        document.getElementById('description').textContent = description.charAt(0).toUpperCase() + description.slice(1);
        
        // 3. Mise à jour de l'heure
        const now = new Date();
        document.getElementById('last-update-time').textContent = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    } catch (error) {
        console.error("Erreur lors du chargement de la météo :", error);
        document.getElementById('description').textContent = "Erreur de chargement. Vérifiez la clé API.";
    }
}

// Lancer le chargement au démarrage et le rafraîchir toutes les 10 minutes
fetchWeather();
setInterval(fetchWeather, 600000); // 600000 ms = 10 minutes
