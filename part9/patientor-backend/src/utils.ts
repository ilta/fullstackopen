import { Gender, NewPatientEntry } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(param);
};

const parseName = (name: unknown) => {
  if (!name || !isString(name))
    throw new Error('Incorrect or missing name');

  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown) => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth))
    throw new Error('Incorrect or missing date of birth');

  return dateOfBirth;
};

const parseSsn = (ssn: unknown) => {
  if (!ssn || !isString(ssn))
    throw new Error('Incorrect or missing social security number');

  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender))
    throw new Error('Incorrect or missing gender');

  return gender;
};

const parseOccupation = (occupation: unknown) => {
  if (!occupation || !isString(occupation))
    throw new Error('Incorrect or missing occupation');

  return occupation;
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object')
    throw new Error('Incorrect or missing data');

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    return {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation)
    };
  }

  throw new Error('Incorrect or missing data');

};

export default toNewPatientEntry;