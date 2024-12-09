import { Router } from "express";
import isAuthenticated from "../middlewares/is-authenticated.js";
import {
  createSharedNodePOST,
  getSharedNodeGET,
} from "../controllers/node-controller.js";

const nodeRouter = Router();

nodeRouter
  .post("", isAuthenticated, createSharedNodePOST)
  .get("/:linkHash", getSharedNodeGET);

export default nodeRouter;
