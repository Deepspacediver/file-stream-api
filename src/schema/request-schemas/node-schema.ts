import { NodeType } from "@prisma/client";
import z from "zod";

export const CreateNodeSchema = z.object({
  body: z
    .object({
      name: z.string({ message: "Name is required" }),
      type: z.nativeEnum(NodeType, {
        message: "You can only create folders or files",
      }),
      parentNodeId: z.coerce.number({
        message: "Uploaded resource does not have parent folder",
      }),
      fileLink: z.string().optional(),
      userId: z.coerce.number().optional(),
      file: z.custom<File>((data) => data instanceof File, {
        message: "File has been sent in a wrong format",
      }),
    })
    .refine(
      (data) => {
        return data.type === NodeType.FILE && data.fileLink;
      },
      { message: "Failed to upload file to the server" }
    ),
});
