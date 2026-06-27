import {useState}from "react";
import axios from "axios";
import Weather from "./components/Weather";
import Forecast from "./components/Forecast";
import "./index.css";

const API_KEY = process.env.REACT_APP_WEATHER_KEY;

function getBackground(condition, isNight) {
  if (isNight) return "bg-night";
  if (!condition) return "bg-sunny";
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle") || c.includes("thunder")) return "bg-rainy";
  if (c.includes("cloud")) return "bg-cloudy";
  if (c.includes("snow")) return "bg-snowy";
  return "bg-sunny";
}

function getOutfit(temp, condition) {

  if (temp <= 10) return "🧥 Heavy coat, gloves, and a warm scarf — it's freezing out there!";
  if (temp <= 17) return "🧣 Light jacket or hoodie recommended. Layer up!";
  if (temp <= 24) return "👕 T-shirt and jeans is perfect for this weather.";
  if (temp <= 30) return "🩳 Light clothes, stay hydrated. Sunglasses recommended!";
  return "🌞 It's very hot! Wear minimal, light-colored clothing and carry water.";
}

function getWeatherIcon(condition) {
  if (!condition) return "🌤️";
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("rain") || c.includes("drizzle")) return "🌧️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("cloud")) return "☁️";
  if (c.includes("mist") || c.includes("fog")) return "🌫️";
  return "☀️";
}

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState(
    () => JSON.parse(localStorage.getItem("fav_cities") || "[]")
  );

  const isNight = weather
    ? Date.now() / 1000 > weather.sys.sunset || Date.now() / 1000 < weather.sys.sunrise
    : false;

  const bgClass = weather
    ? getBackground(weather.weather[0].description, isNight)
    : "bg-sunny";

  async function fetchWeather(searchCity) {
    if (!searchCity.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`)
      ]);
      setWeather(weatherRes.data);
      // Get one reading per day (every 8th item = 24hrs apart)
      const daily = forecastRes.data.list.filter((_, i) => i % 8 === 0).slice(0, 5);
      setForecast(daily);
    } catch (err) {
      setError("City not found. Please check the spelling and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    fetchWeather(city);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") fetchWeather(city);
  }

  function addFavourite() {
    if (!weather) return;
    const name = weather.name;
    if (favourites.includes(name)) return;
    const updated = [...favourites, name];
    setFavourites(updated);
    localStorage.setItem("fav_cities", JSON.stringify(updated));
  }

  function removeFavourite(name) {
    const updated = favourites.filter(f => f !== name);
    setFavourites(updated);
    localStorage.setItem("fav_cities", JSON.stringify(updated));
  }

  return (
    <div className={`app ${bgClass}`}>
      <h1>⛅ WeatherNow</h1>

      {favourites.length > 0 && (
        <div className="favourites">
          {favourites.map(fav => (
            <button key={fav} className="fav-btn"
              onClick={() => { setCity(fav); fetchWeather(fav); }}>
              ⭐ {fav}
              <span onClick={(e) => { e.stopPropagation(); removeFavourite(fav); }}
                style={{ marginLeft: 6, opacity: 0.7 }}>✕</span>
            </button>
          ))}
        </div>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="loading">Fetching weather... ⏳</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="main-grid">
  <div className="left-col">
    <Weather
      weather={weather}
      icon={getWeatherIcon(weather.weather[0].description)}
      onFavourite={addFavourite}
      isFavourite={favourites.includes(weather.name)}
    />
  </div>

  <div className="right-col">
    {forecast.length > 0 && (
      <>
        <Forecast
          forecast={forecast}
          getIcon={getWeatherIcon}
        />

        <div className="outfit-card">
          <h3>👗 What to Wear Today</h3>
          <p>{getOutfit(weather.main.temp, weather.weather[0].description)}</p>
        </div>
      </>
    )}
  </div>
</div>
      )}
    </div>
  );
}