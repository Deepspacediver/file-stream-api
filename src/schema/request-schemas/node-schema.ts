import { NodeType } from "@prisma/client";
import z from "zod";

const FILE_SIZE_LIMIT = 5242880;

export const CreateNodeSchema = z
  .object({
    file: z
      .object({
        fieldname: z.string({
          message: "File has been sent in a wrong format",
        }),
        originalname: z.string({ message: "File is missing a name" }),
        size: z.coerce
          .number({ message: "File is missing" })
          .refine((val) => val <= FILE_SIZE_LIMIT, {
            message: "File cannot exceed size of 5 mb ",
          }),
        mimetype: z.string({ message: "File is missing a type" }),
      })
      .optional(),
    body: z.object({
      name: z.string({ message: "Name is required" }),
      type: z.nativeEnum(NodeType, {
        message: "You can only create folders or files",
      }),
      parentNodeId: z.coerce.number({
        message: "Uploaded resource does not have parent folder",
      }),
      userId: z.coerce
        .number({ message: "Missing user of created resource" })
        .optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.body.type === NodeType.FILE) {
        return data.file;
      }
      return true;
    },
    {
      message: "File must is missing",
    }
  )
  .refine(
    (data) => {
      if (data.body.type === NodeType.FOLDER) {
        return !data.file;
      }
      return true;
    },
    {
      message: "You cannot upload folder as a file",
    }
  );

export const CreateSharedNodeSchema = z.object({
  body: z.object({
    nodeId: z.coerce.number({ message: "Folder to be shared is missing" }),
    expiryDate: z.coerce
      .date({ message: "Expiry date must be a date" })
      .refine((val: Date) => val > new Date(), {
        message: "Expiry date must be set in the future",
      }),
    userId: z.coerce
      .number({ message: "Missing user of created resource" })
      .optional(),
  }),
});
