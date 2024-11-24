import { ErrorRequestHandler } from "express";
import { ZodError, ZodIssue } from "zod";

const DESARIALIZATION_ERROR_DESCRIPTION =
  "Failed to deserialize user out of session";

const getZodErrors = (zodIssues: ZodIssue[]) => {
  return zodIssues.map((err) => err.message).join(", ");
};

export const errorMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    const zodErrors = getZodErrors(err.issues);
    res.status(400).json({ error: zodErrors });
    return;
  }

  if (
    err instanceof Error &&
    err.message === DESARIALIZATION_ERROR_DESCRIPTION
  ) {
    req.logout((err) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
    res.cookie("auth_cookie", { maxAge: new Date() });
    res
      .status(401)
      .json({ error: "User with provided credentials has not been found" });
    return;
  }

  if (err instanceof Error) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
  return;
};
