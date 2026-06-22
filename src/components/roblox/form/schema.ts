import { z } from "zod";
import { phoneField } from "./phoneValidation";

export const leadSchema = z.object({
  parentName: z.string().min(2, "Введіть коректне ім'я"),
  phone: phoneField,
  childAge: z.number().min(7).max(17),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
