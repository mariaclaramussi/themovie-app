import { z } from "zod";

export const ratingSchema = z.object({
  value: z
    .number({ message: "A nota deve ser um número" })
    .min(0.5, "A nota mínima é 0.5")
    .max(10, "A nota máxima é 10"),
});

export type RatingFormValues = z.infer<typeof ratingSchema>;
