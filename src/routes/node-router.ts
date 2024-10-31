import { Router } from "express";
import isAuthenticated from "../middlewares/is-authenticated.js";
import upload from "../config/multer-config.js";
import { uploadNodePOST } from "../controllers/node-controller.js";

const nodeRouter = Router();

nodeRouter.post("/", isAuthenticated, upload.single("node"), uploadNodePOST);

export default nodeRouter;
