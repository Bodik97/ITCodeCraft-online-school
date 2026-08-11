import { z } from "zod";
import { phoneField } from "./phoneValidation";

const AGE_REQUIRED = "Оберіть вік вашої дитини";

export const leadSchema = z
  .object({
    parentName: z.string().min(2, "Введіть коректне ім'я"),
    phone: phoneField,
    childAge: z.number().int().min(7).max(17).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.childAge == null) {
      ctx.addIssue({
        code: "custom",
        path: ["childAge"],
        message: AGE_REQUIRED,
      });
    }
  });

export type LeadFormValues = z.infer<typeof leadSchema>;
