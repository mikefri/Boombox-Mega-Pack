// script.js

// Fonction pour traduire le code météo d'Open-Meteo
function getWeatherDescription(code) {
    // ... (Gardez cette fonction exactement comme précédemment) ...
    switch (code) {
        case 0: return '☀️ Ciel clair';
        case 1:
        case 2: return '🌤️ Partiellement nuageux';
        case 3: return '☁️ Très nuageux';
        case 45: 
        case 48: return '🌫️ Brouillard';
        case 51:
        case 53:
        case 55: return '🌧️ Bruine';
        case 61:
        case 63:
        case 65: return '🌧️ Pluie';
        case 71:
        case 73:
        case 75: return '❄️ Neige';
        case 80:
        case 81:
        case 82: return '🌧️ Averses';
        case 95:
        case 96:
        case 99: return '⛈️ Orage';
        default: return 'Météo inconnue';
    }
}

// 1. NOUVELLE FONCTION : Récupérer le nom de la ville à partir des coordonnées
async function fetchCityName(lat, lon) {
    // API Nominatim pour le Géocodage Inverse (Reverse Geocoding)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur de l\'API Nominatim');
        }
        const data = await response.json();

        // Tenter de trouver le nom de la ville ou du village.
        // Les données de Nominatim sont complexes, on cherche le meilleur candidat :
        if (data.address.city) return data.address.city;
        if (data.address.town) return data.address.town;
        if (data.address.village) return data.address.village;
        if (data.address.country) return data.address.country;

        return `Inconnu (${lat.toFixed(2)}, ${lon.toFixed(2)})`; // Fallback si rien n'est trouvé

    } catch (error) {
        console.error("Erreur de géocodage inverse :", error);
        return `Erreur de géocodage (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
    }
}


// 2. Fonction de Récupération des Données Météo (Mise à jour)
async function fetchWeather(lat, lon) {
    // --- Étape A : Récupérer le nom de la ville ---
    const cityName = await fetchCityName(lat, lon);
    document.getElementById('location').textContent = `Localisation : ${cityName}`;

    // --- Étape B : Récupérer les données Météo ---
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`; 

    try {
        const response = await fetch(weatherUrl);
        // ... (Le reste de la logique de fetchWeather pour la météo et les prévisions reste le même) ...

        if (!response.ok) {
            throw new Error('Erreur de l\'API météo');
        }
        const data = await response.json();

        // --- Météo Actuelle ---
        document.getElementById('temperature').textContent = `${Math.round(data.current.temperature_2m)}°C`;
        document.getElementById('description').textContent = getWeatherDescription(data.current.weather_code);
        
        // --- Prévisions Journalières ---
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = ''; 

        for (let i = 1; i < data.daily.time.length; i++) {
            const dateStr = data.daily.time[i]; 
            const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
            const minTemp = Math.round(data.daily.temperature_2m_min[i]);
            const weatherCode = data.daily.weather_code[i];

            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });

            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-forecast';
            dayDiv.innerHTML = `
                <h3>${dayName}</h3>
                <p class="temp-range">${minTemp}°C / ${maxTemp}°C</p>
                <p class="desc">${getWeatherDescription(weatherCode)}</p>
            `;
            forecastContainer.appendChild(dayDiv);
        }

        // --- Mise à jour de l'heure ---
        const now = new Date();
        document.getElementById('last-update-time').textContent = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    } catch (error) {
        console.error("Erreur lors du chargement de la météo :", error);
        document.getElementById('description').textContent = "Erreur de chargement des données météo.";
    }
}

// 3. Fonction de Géolocalisation (unchangée)
function getLocation() {
    document.getElementById('location').textContent = "Recherche de la position GPS...";
    if (navigator.geolocation) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // Appel des deux APIs avec les coordonnées
                fetchWeather(lat, lon); 
            },
            (error) => {
                let errorMessage = "Erreur GPS : Accès refusé ou position non trouvée.";
                document.getElementById('location').textContent = errorMessage;
                document.getElementById('temperature').textContent = "--°C";
                document.getElementById('description').textContent = "Météo indisponible.";
            },
            options
        );
    } else {
        document.getElementById('location').textContent = "Erreur : La géolocalisation n'est pas supportée.";
    }
}

// Lancement
getLocation(); 
setInterval(getLocation, 600000); // Rafraîchissement toutes les 10 minutes
