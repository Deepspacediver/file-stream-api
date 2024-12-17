import { Router } from "express";
import isAuthenticated from "../middlewares/is-authenticated.js";
import {
  createSharedNodePOST,
  getSharedFolderWithContentGET,
  getSharedNodeTreeGET,
} from "../controllers/node-controller.js";

const nodeRouter = Router();

nodeRouter
  .post("", isAuthenticated, createSharedNodePOST)
  .get("/:linkHash", getSharedFolderWithContentGET)
  .get("/:linkHash/shared-folder-tree", getSharedNodeTreeGET);

export default nodeRouter;
