import { NodeType } from "@prisma/client";
import z from "zod";

const FILE_SIZE_LIMIT = 5242880;

export const CreateNodeSchema = z
  .object({
    params: z.object({
      userId: z.coerce.number({ message: "User id must be a number" }),
    }),
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
      name: z
        .string({ message: "Name is required" })
        .max(15, { message: "Name cannot exceed 15 characters" }),
      type: z.nativeEnum(NodeType, {
        message: "You can only create folders or files",
      }),
      parentNodeId: z.coerce.number({
        message: "Uploaded resource does not have parent folder",
      }),
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
    nodeId: z.coerce.number({ message: "Node id must be a number" }),
    expiryDate: z.coerce
      .date({ message: "Expiry date must be a date" })
      .refine((val: Date) => val > new Date(), {
        message: "Expiry date must be set in the future",
      }),
    userId: z.coerce.number({ message: "User id must be a number " }),
  }),
});

export const DeleteNodeSchema = z.object({
  params: z.object({
    nodeId: z.coerce.number({ message: "Node id must be a number" }),
    userId: z.coerce.number({ message: "User id must be a number" }),
  }),
});

export const GetSharedNodeSchema = z.object({
  params: z.object({
    linkHash: z.string({ message: "Link to the resource is incorrect" }),
  }),
});

export const UpdateNodeSchema = z.object({
  params: z.object({
    nodeId: z.coerce.number({ message: "Node id must be a number" }),
    userId: z.coerce.number({ message: "User id must be a number" }),
  }),
  body: z.object({
    name: z
      .string({
        message: "New name for the resource must be a string",
      })
      .max(15, { message: "Name cannot exceed 15 characters" }),
    parentNodeId: z.coerce.number({
      message: "Id for the parent folder is required",
    }),
  }),
});

export const GetUserFoldersSchema = z.object({
  params: z.object({
    userId: z.coerce.number({ message: "User id must be a number" }),
  }),
});

export const GetUserFolderContentSchema = z.object({
  params: z.object({
    nodeId: z.coerce.number({ message: "Node id must be a number" }),
    userId: z.coerce.number({ message: "User id must be a number" }),
  }),
});
