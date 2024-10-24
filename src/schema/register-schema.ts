import z from "zod";

const CONTAINS_NUMBER_REGEX = new RegExp(/\d/);
const CONTAINS_UPPER_CASE_REGEX = new RegExp(/[A-Z]/);
const CONTAINS_LOWER_CASE_REGEX = new RegExp(/[a-z]/);

const PasswordSchema = z.coerce
  .string({
    message: "Password is required",
  })
  .min(14, { message: "Password must be at least 14 characters long" })
  .refine((val) => CONTAINS_NUMBER_REGEX.test(val), {
    message: "Password must contain a number",
  })
  .refine((val) => CONTAINS_UPPER_CASE_REGEX.test(val), {
    message: "Password must contain an upper case letter",
  })
  .refine((val) => CONTAINS_LOWER_CASE_REGEX.test(val), {
    message: "Password must contain a lower case letter",
  });

export const RegisterSchema = z.object({
  body: z.object({
    username: z.coerce
      .string({ message: "Username is required" })
      .min(5, { message: "Username must be at least 5 characters long" })
      .max(20, { message: "Username cannot be longer than 20 characters" }),
  }),
  password: PasswordSchema,
});
