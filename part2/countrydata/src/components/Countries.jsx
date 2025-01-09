import Languages from './Languages';
import Weather from './Weather';

const CountryLine = ({ country, weatherData, setWeatherData }) => {
  // Note: this is an array that may include one or more capitals
  const capital = country.capital[0];

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {capital}</div>
      <div>area {country.area}</div>
      <Languages languages={country.languages} />
      <img src={country.flags.png} alt={country.flags.alt} width="200" />
      <Weather
        capital={capital}
        weatherData={weatherData}
        setWeatherData={setWeatherData}
      />
    </div>
  );
};

const Countries = ({
  filter,
  countries,
  handleClickCountry,
  weatherData,
  setWeatherData,
}) => {
  if (!countries) return null;

  const filteredCountries = countries.filter((c) =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filter === '') return null;
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return (
      <CountryLine
        country={country}
        weatherData={weatherData}
        setWeatherData={setWeatherData}
      />
    );
  } else if (filteredCountries.length > 10)
    return <div>Too many matches, specify another filter</div>;
  else {
    return filteredCountries.map((filteredCountry) => (
      <div key={filteredCountry.cca2}>
        {filteredCountry.name.common}
        <button onClick={() => handleClickCountry(filteredCountry.name.common)}>
          show
        </button>
      </div>
    ));
  }
};

export default Countries;
