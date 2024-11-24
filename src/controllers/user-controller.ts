import asyncHandler from "express-async-handler";
import schemaParser from "../helpers/schema-parser.js";
import {
  CreateUserSchema,
  UserDataSchema,
} from "../schema/request-schemas/user-schema.js";
import {
  createNode,
  createUser,
  deleteNode,
  getUserDataWithNodeTree,
  getUserFolders,
  updateNodeName,
} from "../db/user-queries.js";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "../helpers/auth-helpers.js";
import {
  CreateNodeSchema,
  DeleteNodeSchema,
  GetUserFoldersSchema,
  UpdateNodeNameSchema,
} from "../schema/request-schemas/node-schema.js";
import { randomUUID } from "crypto";
import cloudinary from "../config/cloudinary-config.js";
import { CreateNode } from "../types/node-types.js";

export const getUserDataWithNodeTreeGET = asyncHandler(async (req, res) => {
  schemaParser(UserDataSchema, req);
  const { userId } = req.params;
  const data = await getUserDataWithNodeTree(+userId);
  if (!data) {
    res.status(404).json({ error: "User does not exist" });
    return;
  }
  res.json(data);
});

export const createUserPOST = asyncHandler(async (req, res, next) => {
  schemaParser(CreateUserSchema, req);

  const { username, password } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return next(err);
    }

    const user = await createUser({ username, password: hash });
    if (!user) {
      return next(new Error("Failed to created user"));
    }

    req.login(user, (err) => {
      if (err) {
        next(err);
      }
      setAuthCookie(user, res);
      res.json({ username: user.username, userId: user.userId });
    });
  });
});

export const getUserFoldersGET = asyncHandler(async (req, res) => {
  schemaParser(GetUserFoldersSchema, req);
  const { userId } = req.params;
  const folders = await getUserFolders(+userId);
  res.json(folders);
});

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
  const { parentNodeId, name, type } = req.body;
  const { userId } = req.params;
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

export const updateNodeNamePUT = asyncHandler(async (req, res) => {
  schemaParser(UpdateNodeNameSchema, req);
  const { nodeId } = req.params;
  const { newName } = req.body;
  const node = await updateNodeName(+nodeId, newName);
  res.json({ node });
});

export const deleteNodeDELETE = asyncHandler(async (req, res) => {
  schemaParser(DeleteNodeSchema, req);
  const { nodeId } = req.params;
  await deleteNode(+nodeId);
  res.json({ message: "Deleted successfully." });
});
