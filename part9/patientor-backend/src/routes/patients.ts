import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import { NewPatientEntrySchema } from '../utils';
import { z } from 'zod';
import { NewPatientEntry, Patient } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatientEntries());
});

router.get('/:id', (req, res) => {
  // TODO: add error handling for invalid IDs in the future (using middleware?)
  const foundPatient = patientService
    .getEntries()
    .find((p) => p.id === req.params.id);
  res.send(foundPatient);
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleWare = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError)
    res.status(400).send({ error: error.issues });
  else next(error);
};

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

router.use(errorMiddleWare);

export default router;
