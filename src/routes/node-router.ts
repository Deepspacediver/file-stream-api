import { Router } from "express";
import isAuthenticated from "../middlewares/is-authenticated.js";
import upload from "../config/multer-config.js";
import {
  createSharedNodePOST,
  deleteNodeDELETE,
  getSharedNodeGET,
  uploadNodePOST,
} from "../controllers/node-controller.js";

const nodeRouter = Router();

nodeRouter
  .post("/", isAuthenticated, upload.single("file"), uploadNodePOST)
  .delete("/:nodeId", isAuthenticated, deleteNodeDELETE)
  .post("/shared", isAuthenticated, createSharedNodePOST)
  .get("/shared/:linkHash", getSharedNodeGET);

export default nodeRouter;
