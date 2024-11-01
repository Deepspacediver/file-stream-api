import { Router } from "express";
import isAuthenticated from "../middlewares/is-authenticated.js";
import upload from "../config/multer-config.js";
import {
  createSharedNodePOST,
  deleteNodeDELETE,
  uploadNodePOST,
} from "../controllers/node-controller.js";

const nodeRouter = Router();

nodeRouter
  .post("/", isAuthenticated, upload.single("file"), uploadNodePOST)
  .post("/shared", isAuthenticated, createSharedNodePOST)
  .delete("/:nodeId", isAuthenticated, deleteNodeDELETE);

export default nodeRouter;
