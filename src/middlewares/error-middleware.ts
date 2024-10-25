import { ErrorRequestHandler } from "express";
import { ZodError, ZodIssue } from "zod";

const getZodErrors = (zodIssues: ZodIssue[]) => {
  return zodIssues.map((err) => err.message).join(", ");
};

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const zodErrors = getZodErrors(err.issues);
    res.status(400).json({ error: zodErrors });
    return;
  }

  if (err instanceof Error) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
  return;
};
