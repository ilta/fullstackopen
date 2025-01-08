import { useState, useEffect } from 'react';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Persons from './components/Persons';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');

  useEffect(() => {
    personService.getAll().then((initalPersons) => {
      setPersons(initalPersons);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const handleDeleteRecord = (id) => {
    const personName = persons.find((person) => person.id === id).name;
    if (window.confirm(`Delete ${personName}?`)) {
      const note = persons.find((n) => n.id === id);

      personService
        .deleteRecord(id)
        .then(() => {
          console.log(`Deleted person ${id}`);
        })
        .catch((error) => {
          console.log(
            `The record '${personName}' was already deleted from server`
          );
        });

      // Delete the person on the client
      setPersons(persons.filter((p) => p.id !== id));
    }
  };

  const addName = (event) => {
    event.preventDefault();

    if (persons.find((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const phoneObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(phoneObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName('');
      setNewNumber('');
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        newFilter={newFilter}
        handleDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
};

export default App;
