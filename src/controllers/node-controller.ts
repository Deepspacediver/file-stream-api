import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary-config.js";
import schemaParser from "../helpers/schema-parser.js";
import { CreateNodeSchema } from "../schema/request-schemas/node-schema.js";
import { randomUUID } from "crypto";
import { CreateNode } from "../types/node-types.js";
import { createNode } from "../db/node-queries.js";

export const uploadNodePOST = asyncHandler(async (req, res) => {
  schemaParser(CreateNodeSchema, req);
  //File is checked in schema
  const file = req.file;
  let fileLink: string | null = null;

  if (file) {
    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;

    const fileName = file.originalname.replace(/\.[^.]*$/, "");
    const result = await cloudinary.uploader.upload(dataURI, {
      public_id: `${fileName}-${randomUUID()}`,
      resource_type: "auto",
      flags: "attachment",
    });
    fileLink = result.secure_url;
  }

  const { parentNodeId, name, userId, type } = req.body;
  const dataToSend: CreateNode = {
    parentNodeId: +parentNodeId,
    name,
    userId: +userId,
    type,
    ...(!!fileLink && { fileLink }),
  };
  const node = await createNode(dataToSend);
  res.json({ node });
});
