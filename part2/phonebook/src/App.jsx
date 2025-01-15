import { useState, useEffect } from 'react';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Persons from './components/Persons';
import Notification from './components/Notification';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [notification, setNotification] = useState({
    type: null,
    message: null,
  });

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
          setNotification({
            type: 'info',
            message: `Deleted person ${personName}`,
          });
          setTimeout(
            () => setNotification({ type: null, message: null }),
            5000
          );
        })
        .catch((error) => {
          setNotification({
            type: 'error',
            message: `The record '${personName}' was already deleted from server`,
          });
          setTimeout(
            () => setNotification({ type: null, message: null }),
            5000
          );
        });

      // Delete the person on the client
      setPersons(persons.filter((p) => p.id !== id));
    }
  };

  // Helper function for updating existing number
  const updateExistingNumber = (personToUpdate) => {
    const changedNumber = { ...personToUpdate, number: newNumber };
    const id = personToUpdate.id;
    personService
      .update(id, changedNumber)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) => (person.id !== id ? person : returnedPerson))
        );
        setNewName('');
        setNewNumber('');
        setNotification({
          type: 'info',
          message: `Updated '${personToUpdate.name}'`,
        });
        setTimeout(() => setNotification({ type: null, message: null }), 5000);
      })
      .catch((error) => {
        setNotification({
          type: 'error',
          message: error.response.data.error,
        });
        setTimeout(() => setNotification({ type: null, message: null }), 5000);
      });
  };

  // Add or update records, called in PersonForm
  const addRecord = (event) => {
    event.preventDefault();
    const personToUpdate = persons.find((person) => person.name === newName);

    if (personToUpdate) {
      // Updating existing number
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        updateExistingNumber(personToUpdate);
      }
    } else {
      // Normal addition
      const phoneObject = {
        name: newName,
        number: newNumber,
      };

      personService
        .create(phoneObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification({ type: 'info', message: `Added ${newName}` });
          setTimeout(
            () => setNotification({ type: null, message: null }),
            5000
          );
        })
        .catch((error) => {
          setNotification({
            type: 'error',
            message: error.response.data.error,
          });
          setTimeout(
            () => setNotification({ type: null, message: null }),
            5000
          );
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addName={addRecord}
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
