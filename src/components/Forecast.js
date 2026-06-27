const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Forecast({ forecast, getIcon }) {
  return (
    <div className="forecast">
      {forecast.map((item, i) => {
        const date = new Date(item.dt * 1000);
        const day = i === 0 ? "Today" : DAYS[date.getDay()];
        return (
          <div className="forecast-card" key={i}>
            <div className="day">{day}</div>
            <div className="f-icon">{getIcon(item.weather[0].description)}</div>
            <div className="f-desc">{item.weather[0].description}</div>
            <div className="f-temp">{Math.round(item.main.temp)}°C</div>
          </div>
        );
      })}
    </div>
  );
}