export default function Weather({ weather, icon, onFavourite, isFavourite }) {
const name = weather.name;
const country = weather.sys.country;
const temp = weather.main.temp;
const description = weather.weather[0].description;
const humidity = weather.main.humidity;
const wind = weather.wind.speed;
  return (
    <div className="weather-card">
      <div className="weather-icon">{icon}</div>
      <div className="city">{name}</div>
      <div className="country">{country}</div>
      <div className="temp">{Math.round(temp)}°C</div>
      <div className="description">{description}</div>

      <button
        onClick={onFavourite}
        style={{
          background: isFavourite ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.2)",
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: "20px",
          padding: "8px 20px",
          color: "white",
          cursor: isFavourite ? "default" : "pointer",
          fontSize: "14px",
          marginBottom: "10px"
        }}
      >
        {isFavourite ? "⭐ Saved to Favourites" : "☆ Save to Favourites"}
      </button>

      <div className="stats">
        <div className="stat-item">
          <div className="label">Feels Like</div>
          <div className="value">{Math.round(weather.main.feels_like)}°C</div>
        </div>
        <div className="stat-item">
          <div className="label">Humidity</div>
          <div className="value">{humidity}%</div>
        </div>
        <div className="stat-item">
          <div className="label">Wind</div>
          <div className="value">{wind} m/s</div>
        </div>
        <div className="stat-item">
          <div className="label">Pressure</div>
          <div className="value">{weather.main.pressure} hPa</div>
        </div>
      </div>
    </div>
  );
}