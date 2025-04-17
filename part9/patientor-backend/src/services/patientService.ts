import patients from '../../data/patients';
import {
  Patient,
  NonSensitivePatient,
  NewPatientEntry,
  NewEntry,
} from '../types';
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
    ...entry,
    id: uuid(),
    entries: [],
  };

  patients.push(newEntry);
  return newEntry;
};

const addVisit = (patientId: string, entry: NewEntry): Patient => {
  const patientToModify: Patient | undefined = patients.find(
    (patient) => patient.id === patientId
  );

  const newVisit = {
    ...entry,
    id: uuid(),
  };

  if (patientToModify) {
    patientToModify.entries.push(newVisit);
    return patientToModify;
  } else {
    throw new Error(`Patient ${patientId} not found`);
  }
};

export default {
  getEntries,
  getNonSensitivePatientEntries,
  addPatient,
  addVisit,
};
