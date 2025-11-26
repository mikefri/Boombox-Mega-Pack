// script.js
// Pas de clé API nécessaire avec Open-Meteo !

// Fonction pour traduire le code météo d'Open-Meteo en texte ou emoji
function getWeatherDescription(code) {
    // Les codes sont basés sur la classification WMO (Organisation Météorologique Mondiale)
    switch (code) {
        case 0: return '☀️ Ciel clair';
        case 1:
        case 2: return '🌤️ Partiellement nuageux';
        case 3: return '☁️ Très nuageux';
        case 45: 
        case 48: return '🌫️ Brouillard';
        case 51:
        case 53:
        case 55: return '🌧️ Bruine légère';
        case 61:
        case 63:
        case 65: return '🌧️ Pluie';
        case 71:
        case 73:
        case 75: return '❄️ Chute de neige';
        case 80:
        case 81:
        case 82: return '🌧️ Averses';
        case 95:
        case 96:
        case 99: return '⛈️ Orage';
        default: return 'Météo inconnue';
    }
}


async function fetchWeather(lat, lon) {
    // 1. URL de l'API Open-Meteo utilisant la lat/lon
    // Nous demandons la température actuelle, le code météo, et l'heure locale
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur de l\'API météo');
        }
        const data = await response.json();

        // 2. Mise à jour du HTML
        document.getElementById('location').textContent = `Météo pour : ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        document.getElementById('temperature').textContent = `${Math.round(data.current.temperature_2m)}°C`;
        
        const description = getWeatherDescription(data.current.weather_code);
        document.getElementById('description').textContent = description;
        
        // 3. Mise à jour de l'heure
        const now = new Date();
        document.getElementById('last-update-time').textContent = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    } catch (error) {
        console.error("Erreur lors du chargement de la météo :", error);
        document.getElementById('description').textContent = "Erreur de chargement des données météo.";
    }
}

function getLocation() {
    // Vérifie si le navigateur supporte la géolocalisation
    if (navigator.geolocation) {
        // Options pour une lecture précise et rapide du GPS
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        // Lancement de la demande de position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Succès : position trouvée
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                document.getElementById('location').textContent = "Position GPS trouvée...";
                
                // On appelle la fonction de météo avec la nouvelle position
                fetchWeather(lat, lon);
            },
            (error) => {
                // Échec : gestion des erreurs (ex: l'utilisateur refuse le partage)
                let errorMessage = "Erreur GPS : ";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += "Accès à la position refusé par l'utilisateur.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += "Position non disponible.";
                        break;
                    case error.TIMEOUT:
                        errorMessage += "Délai de recherche de position expiré.";
                        break;
                    default:
                        errorMessage += "Erreur inconnue.";
                }
                document.getElementById('location').textContent = errorMessage;
                document.getElementById('temperature').textContent = "--°C";
                document.getElementById('description').textContent = "Météo indisponible.";
            },
            options
        );
    } else {
        // Le navigateur ne supporte pas l'API
        document.getElementById('location').textContent = "Erreur : La géolocalisation n'est pas supportée par ce navigateur.";
    }
}

// Lancer le processus de localisation au démarrage
getLocation(); 
// Rafraîchir toutes les 10 minutes (recherche de position + météo)
setInterval(getLocation, 600000);
