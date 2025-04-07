import patients from '../../data/patients';
import { Patient, NonSensitivePatient } from '../types';

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitivePatientEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

export default {
  getEntries,
  getNonSensitivePatientEntries
};