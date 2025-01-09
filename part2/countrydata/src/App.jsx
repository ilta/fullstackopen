import { useState, useEffect } from 'react';
import axios from 'axios';

const Languages = ({ languages }) => {
  /*
  Languages are stored as an object, e.g.:

    "languages": {
      "fin": "Finnish",
      "swe": "Swedish"
    }
  
  Hence we first need an array
  */
  const languageArray = Object.values(languages);

  return (
    <div>
      <h3>languages</h3>
      {languageArray.map((language) => (
        <li key={language}>{language}</li>
      ))}
    </div>
  );
};

const Countries = ({ filter, countries }) => {
  if (!countries) return null;

  const filteredCountries = countries.filter((c) =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filter === '') return null;
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];

    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <Languages languages={country.languages} />
        <img src={country.flags.png} alt={country.flags.alt} width="200" />
      </div>
    );
  } else if (filteredCountries.length > 10)
    return <div>Too many matches, specify another filter</div>;
  else {
    return filteredCountries.map((filteredCountry) => (
      <div key={filteredCountry.name.common}>{filteredCountry.name.common}</div>
    ));
  }
};

function App() {
  const [filter, setFilter] = useState('');
  const [countries, setCountries] = useState(null);

  const handleCountryChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  return (
    <>
      find countries <input value={filter} onChange={handleCountryChange} />
      <Countries countries={countries} filter={filter} />
    </>
  );
}

export default App;
