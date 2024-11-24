import asyncHandler from "express-async-handler";
import schemaParser from "../helpers/schema-parser.js";
import {
  CreateSharedNodeSchema,
  GetSharedNodeSchema,
} from "../schema/request-schemas/node-schema.js";
import { createSharedNode, getSharedNodeTree } from "../db/node-queries.js";

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
