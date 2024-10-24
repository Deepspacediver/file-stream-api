import { ZodSchema } from "zod";
import { Request } from "express";

const schemaParser = (schema: ZodSchema, req: Request) => {
  schema.parse({
    body: req.body,
    params: req.params,
    query: req.query,
  });
};

export default schemaParser;
