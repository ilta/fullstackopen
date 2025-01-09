import Languages from './Languages';

const CountryLine = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <Languages languages={country.languages} />
      <img src={country.flags.png} alt={country.flags.alt} width="200" />
    </div>
  );
};

const Countries = ({ filter, countries, handleClickCountry }) => {
  if (!countries) return null;

  const filteredCountries = countries.filter((c) =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filter === '') return null;
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return <CountryLine country={country} />;
  } else if (filteredCountries.length > 10)
    return <div>Too many matches, specify another filter</div>;
  else {
    return filteredCountries.map((filteredCountry) => (
      <div key={filteredCountry.name.common}>
        {filteredCountry.name.common}
        <button onClick={() => handleClickCountry(filteredCountry.name.common)}>
          show
        </button>
      </div>
    ));
  }
};

export default Countries;
