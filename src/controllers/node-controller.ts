import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary-config.js";
import schemaParser from "../helpers/schema-parser.js";
import {
  CreateNodeSchema,
  CreateSharedNodeSchema,
  DeleteNodeSchema,
  GetSharedNodeSchema,
  UpdateNodeNameSchema,
} from "../schema/request-schemas/node-schema.js";
import { randomUUID } from "crypto";
import { CreateNode } from "../types/node-types.js";
import {
  createNode,
  createSharedNode,
  deleteNode,
  getSharedNodeTree,
  updateNodeName,
} from "../db/node-queries.js";

export const uploadNodePOST = asyncHandler(async (req, res) => {
  schemaParser(CreateNodeSchema, req);
  //File is checked in schema
  const file = req.file;
  let fileLink: string | null = null;
  let filePublicId: string | null = null;

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
    filePublicId = result.public_id;
  }

  const { parentNodeId, name, userId, type } = req.body;
  const dataToSend: CreateNode = {
    parentNodeId: +parentNodeId,
    name,
    userId: +userId,
    type,
    ...(!!fileLink && { fileLink }),
    ...(!!filePublicId && { publicId: filePublicId }),
  };
  const node = await createNode(dataToSend);
  res.json({ node });
});

export const createSharedNodePOST = asyncHandler(async (req, res) => {
  schemaParser(CreateSharedNodeSchema, req);
  const { expiryDate, nodeId, userId } = req.body;
  const createdSharedNode = await createSharedNode({
    nodeIdToShare: nodeId,
    expiryDate,
    userId,
  });
  res.json({ link: createdSharedNode });
});

export const getSharedNodeGET = asyncHandler(async (req, res) => {
  schemaParser(GetSharedNodeSchema, req);
  const { linkHash } = req.params;
  const nodeTree = await getSharedNodeTree(linkHash);
  res.json({ drive: nodeTree });
});

export const deleteNodeDELETE = asyncHandler(async (req, res) => {
  schemaParser(DeleteNodeSchema, req);
  const { nodeId } = req.params;
  await deleteNode(+nodeId);
  res.json({ message: "Deleted successfully." });
});

export const updateNodeNamePUT = asyncHandler(async (req, res) => {
  schemaParser(UpdateNodeNameSchema, req);
  const { nodeId } = req.params;
  const { newName } = req.body;
  const node = await updateNodeName(+nodeId, newName);
  res.json({ node });
});
