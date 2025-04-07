import diagnoseData from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getEntries = (): Diagnosis[] => {
  return diagnoseData;
};

export default {
  getEntries
};