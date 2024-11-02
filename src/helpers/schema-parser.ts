import { ZodSchema } from "zod";
import { Request } from "express";

const schemaParser = (schema: ZodSchema, req: Request) => {
  schema.parse(req);
};

export default schemaParser;
