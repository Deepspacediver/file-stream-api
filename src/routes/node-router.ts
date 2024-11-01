import { Router } from "express";
import isAuthenticated from "../middlewares/is-authenticated.js";
import upload from "../config/multer-config.js";
import {
  createSharedNodePOST,
  uploadNodePOST,
} from "../controllers/node-controller.js";

const nodeRouter = Router();

nodeRouter
  .post("/", isAuthenticated, upload.single("file"), uploadNodePOST)
  .post("/shared", isAuthenticated, createSharedNodePOST);

export default nodeRouter;
