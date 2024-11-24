import { Router } from "express";
import {
  createUserPOST,
  deleteNodeDELETE,
  getUserDataWithNodeTreeGET,
  getUserFoldersGET,
  updateNodeNamePUT,
  uploadNodePOST,
} from "../controllers/user-controller.js";
import isAuthenticated from "../middlewares/is-authenticated.js";
import upload from "../config/multer-config.js";

const usersRouter = Router();

usersRouter
  .post("/", createUserPOST)
  .get("/:userId", getUserDataWithNodeTreeGET)
  .post(
    "/:userId/nodes",
    isAuthenticated,
    upload.single("file"),
    uploadNodePOST
  )
  .put("/:userId/nodes/:nodeId", isAuthenticated, updateNodeNamePUT)
  .get("/:userId/folders", getUserFoldersGET)
  .delete("/:userId/nodes/:nodeID", isAuthenticated, deleteNodeDELETE);

export default usersRouter;
