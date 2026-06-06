import { z } from "zod";
import { validatePhoneE164 } from "./phoneValidation";

export const questionSchema = z.object({
  name: z.string().min(2, "Введіть коректне ім'я"),
  phone: z.string().superRefine((value, ctx) => {
    const result = validatePhoneE164(value);
    if (result !== true) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: result });
    }
  }),
  question: z
    .string()
    .min(10, "Напишіть запитання детальніше (мінімум 10 символів)")
    .max(1000, "Запитання занадто довге"),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
