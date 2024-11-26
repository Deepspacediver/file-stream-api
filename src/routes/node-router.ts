import { Router } from "express";
import isAuthenticated from "../middlewares/is-authenticated.js";
import {
  createSharedNodePOST,
  getSharedNodeGET,
} from "../controllers/node-controller.js";

const nodeRouter = Router();

nodeRouter
  .post("/shared", isAuthenticated, createSharedNodePOST)
  .get("/shared/:linkHash", getSharedNodeGET);

export default nodeRouter;
