import { z } from "zod";
import { validatePhoneE164 } from "./phoneValidation";

export const leadSchema = z.object({
  parentName: z.string().min(2, "Введіть коректне ім'я"),
  phone: z.string().superRefine((value, ctx) => {
    const result = validatePhoneE164(value);
    if (result !== true) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: result });
    }
  }),
  childAge: z.coerce.number().min(7).max(17),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
