import patients from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatientEntry } from '../types';
import { v1 as uuid } from 'uuid';

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitivePatientEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newEntry = {
    id: uuid(),
    ...entry,
    entries: [], // Note: a temporary trick to satisfy TS until '../../patients.ts' has proper data
  };

  patients.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  getNonSensitivePatientEntries,
  addPatient,
};
