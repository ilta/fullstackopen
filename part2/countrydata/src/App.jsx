import { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './components/Countries';

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
