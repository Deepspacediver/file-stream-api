import z from "zod";

const CONTAINS_NUMBER_REGEX = new RegExp(/\d/);
const CONTAINS_UPPER_CASE_REGEX = new RegExp(/[A-Z]/);
const CONTAINS_LOWER_CASE_REGEX = new RegExp(/[a-z]/);

const PasswordSchema = z.coerce
  .string({
    message: "Password is required",
  })
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(CONTAINS_NUMBER_REGEX, "Password must contain a number")
  .regex(
    CONTAINS_UPPER_CASE_REGEX,
    "Password must contain an upper case letter"
  )
  .regex(
    CONTAINS_LOWER_CASE_REGEX,
    "Password must contain a lower case letter"
  );

export const CreateUserSchema = z.object({
  body: z.object({
    username: z.coerce
      .string({ message: "Username is required" })
      .min(5, { message: "Username must be at least 5 characters long" })
      .max(20, { message: "Username cannot be longer than 20 characters" }),
    password: PasswordSchema,
  }),
});

export const UserDataSchema = z.object({
  params: z.object({
    userId: z.coerce.number({ message: "userId must be a number" }),
  }),
});
