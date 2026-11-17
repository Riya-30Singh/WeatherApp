
document.addEventListener("DOMContentLoaded", function () {

    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const message = document.getElementById("message");
    const weatherCard = document.getElementById("weatherCard");

    console.log("Weather App JavaScript Connected!");

    if (!searchBtn) {
        console.error("Search button not found!");
        return;
    }

    async function getWeather() {

        const city = cityInput.value.trim();

        if (city === "") {
            message.textContent = "Please enter a city name!";
            return;
        }

        searchBtn.disabled = true;
        searchBtn.textContent = "Searching...";
        message.textContent = "Loading weather information...";
        weatherCard.classList.add("hidden");

        try {

            // Get city coordinates
            const geoURL =
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

            const geoResponse = await fetch(geoURL);

            if (!geoResponse.ok) {
                throw new Error("Location API connection failed!");
            }

            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("City not found!");
            }

            const location = geoData.results[0];

            // Get weather information
            const weatherURL =
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;

            const weatherResponse = await fetch(weatherURL);

            if (!weatherResponse.ok) {
                throw new Error("Weather API connection failed!");
            }

            const weatherData = await weatherResponse.json();

            const current = weatherData.current;

            // Weather conditions
            const weatherTypes = {
                0: ["Clear Sky", "☀️"],
                1: ["Mainly Clear", "🌤️"],
                2: ["Partly Cloudy", "⛅"],
                3: ["Overcast", "☁️"],
                45: ["Foggy", "🌫️"],
                48: ["Foggy", "🌫️"],
                51: ["Drizzle", "🌦️"],
                53: ["Drizzle", "🌦️"],
                55: ["Drizzle", "🌦️"],
                61: ["Rainy", "🌧️"],
                63: ["Rainy", "🌧️"],
                65: ["Heavy Rain", "🌧️"],
                71: ["Snowy", "❄️"],
                73: ["Snowy", "❄️"],
                75: ["Snowy", "❄️"],
                80: ["Rain Showers", "🌦️"],
                81: ["Rain Showers", "🌧️"],
                82: ["Heavy Showers", "🌧️"],
                95: ["Thunderstorm", "⛈️"],
                96: ["Thunderstorm", "⛈️"],
                99: ["Thunderstorm", "⛈️"]
            };

            const weather =
                weatherTypes[current.weather_code] ||
                ["Unknown Weather", "🌍"];

            // Display weather details
            document.getElementById("cityName").textContent =
                location.name;

            document.getElementById("countryName").textContent =
                location.country;

            document.getElementById("temperature").textContent =
                Math.round(current.temperature_2m) + "°C";

            document.getElementById("condition").textContent =
                weather[0];

            document.getElementById("weatherIcon").textContent =
                current.is_day === 0 && current.weather_code === 0
                    ? "🌙"
                    : weather[1];

            document.getElementById("humidity").textContent =
                current.relative_humidity_2m + "%";

            document.getElementById("windSpeed").textContent =
                current.wind_speed_10m + " km/h";

            document.getElementById("feelsLike").textContent =
                Math.round(current.apparent_temperature) + "°C";

            message.textContent = "";

            weatherCard.classList.remove("hidden");

        }

        catch (error) {

            message.textContent = error.message;

            console.error("Error:", error);

        }

        finally {

            searchBtn.disabled = false;
            searchBtn.textContent = "Search";

        }
    }

    // Button click event
    searchBtn.addEventListener("click", getWeather);

    // Enter key event
    cityInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            getWeather();
        }
    });

});
