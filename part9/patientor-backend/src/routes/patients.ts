import express, { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import patientService from '../services/patientService';
import {
  assertNever,
  NewHealthCheckVisitSchema,
  NewHospitalVisitSchema,
  NewOccupationalHealthCareVisitSchema,
  NewPatientEntrySchema,
} from '../utils';
import { z } from 'zod';
import { Entry, NewEntry, NewPatientEntry, Patient } from '../types';

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

const newVisitParser = (
  req: Request<ParamsDictionary, unknown, Entry>,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  try {
    switch (body.type) {
      case 'HealthCheck':
        NewHealthCheckVisitSchema.parse(body);
        next();
        break;
      case 'Hospital':
        NewHospitalVisitSchema.parse(body);
        next();
        break;
      case 'OccupationalHealthcare':
        NewOccupationalHealthCareVisitSchema.parse(body);
        next();
        break;
      default:
        res.json('Error: unknown visit type');
        assertNever(body);
    }
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

router.post(
  '/:id/entries',
  newVisitParser,
  (
    req: Request<ParamsDictionary, unknown, NewEntry>,
    res: Response<Patient>
  ) => {
    const patientId = req.params.id;
    const addedVisit = patientService.addVisit(patientId, req.body);
    res.json(addedVisit);
  }
);

router.use(errorMiddleWare);

export default router;
