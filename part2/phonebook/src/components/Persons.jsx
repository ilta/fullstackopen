const Persons = ({ persons, newFilter, handleDeleteRecord }) => {
  return (
    <div>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        )
        .map((filteredRecord) => (
          <div key={filteredRecord.id}>
            {filteredRecord.name} {filteredRecord.number}{' '}
            <button onClick={() => handleDeleteRecord(filteredRecord.id)}>
              delete
            </button>
          </div>
        ))}
    </div>
  );
};

export default Persons;
