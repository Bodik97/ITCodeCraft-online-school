import { z } from "zod";
import { phoneField } from "./phoneValidation";

export const questionSchema = z.object({
  name: z.string().min(2, "Введіть коректне ім'я"),
  phone: phoneField,
  question: z
    .string()
    .min(10, "Напишіть запитання детальніше (мінімум 10 символів)")
    .max(1000, "Запитання занадто довге"),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
