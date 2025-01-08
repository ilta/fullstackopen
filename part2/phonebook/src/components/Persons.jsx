const Persons = ({ persons, newFilter }) => {
  return (
    <div>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        )
        .map((filteredRecord) => (
          <div key={filteredRecord.id}>
            {filteredRecord.name} {filteredRecord.number}
          </div>
        ))}
    </div>
  );
};

export default Persons;
