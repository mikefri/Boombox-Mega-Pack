const LATITUDE = 47.0811; // Exemple : Coordonnées de Nevers, France
const LONGITUDE = 3.1610; 

async function fetchWeatherOpenMeteo() {
    // API pour la météo actuelle et les prévisions quotidiennes (jusqu'à 7 jours)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Récupération des données actuelles
        const currentTemp = data.current.temperature_2m;
        // Le code météo doit être mappé (traduit) en description/emoji
        const weatherCode = data.current.weather_code; 
        
        document.getElementById('location').textContent = `Météo pour (${LATITUDE}, ${LONGITUDE})`;
        document.getElementById('temperature').textContent = `${Math.round(currentTemp)}°C`;
        // Il vous faudrait une fonction pour traduire 'weather_code' en texte (ex: 3 -> nuageux)

        // TODO: Mettre à jour les prévisions journalières (data.daily) dans le div #forecast

        const now = new Date();
        document.getElementById('last-update-time').textContent = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    } catch (error) {
        console.error("Erreur lors du chargement de la météo Open-Meteo :", error);
        document.getElementById('description').textContent = "Erreur de chargement de l'API.";
    }
}

fetchWeatherOpenMeteo();
// ... (gardez l'intervalle de rafraîchissement)
