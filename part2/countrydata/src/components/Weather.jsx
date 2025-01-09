import { useEffect } from 'react';
import axios from 'axios';

const Weather = ({ weatherData, setWeatherData, capital }) => {
  /* Remember: start the dev server like this (Linux/Mac bash):
  export VITE_API_KEY="USE YOUR API KEY" && npm run dev
  */
  const api_key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
      )
      .then((response) => {
        setWeatherData(response.data);
      });
  }, []);

  // Sanity checks
  if (
    weatherData &&
    weatherData.main &&
    weatherData.main.temp &&
    weatherData.wind &&
    weatherData.wind.speed &&
    weatherData.weather &&
    weatherData.weather[0].icon
  ) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <div>temperature {weatherData.main.temp} °C</div>
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        />
        <div>wind {weatherData.wind.speed} m/s</div>
      </div>
    );
  }
};

export default Weather;
