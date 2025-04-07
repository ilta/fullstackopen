import { Gender } from "./types";
import { z } from 'zod';

export const NewPatientEntrySchema = z.object({
  name: z.string().min(3),
  dateOfBirth: z.string().date(),
  ssn: z.string().length(11),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(2)
});