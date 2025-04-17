import { Gender, HealthCheckRating } from './types';
import { z } from 'zod';

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const NewPatientEntrySchema = z.object({
  name: z.string().min(3),
  dateOfBirth: z.string().date(),
  ssn: z.string().length(11),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(2),
});

const NewVisitBaseSchema = z.object({
  date: z.string().date(),
  description: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const NewHospitalVisitSchema = NewVisitBaseSchema.extend({
  type: z.string().includes('Hospital'),
  discharce: z.object({ date: z.date(), criteria: z.string() }).optional(),
});

export const NewHealthCheckVisitSchema = NewVisitBaseSchema.extend({
  type: z.string().includes('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

export const NewOccupationalHealthCareVisitSchema = NewVisitBaseSchema.extend({
  type: z.string().includes('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});
