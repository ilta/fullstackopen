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

export default Languages;
