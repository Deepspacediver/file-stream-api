import { Router } from "express";
import {
  createUserPOST,
  deleteNodeDELETE,
  getUserFolderContentGET,
  getUserFoldersGET,
  getUserFolderTreeGET,
  updateNodePOST,
  uploadNodePOST,
} from "../controllers/user-controller.js";
import isAuthenticated from "../middlewares/is-authenticated.js";
import upload from "../config/multer-config.js";

const usersRouter = Router();

usersRouter
  .post("/", createUserPOST)

  .post(
    "/:userId/nodes",
    isAuthenticated,
    upload.single("file"),
    uploadNodePOST
  )
  .put("/:userId/nodes/:nodeId", isAuthenticated, updateNodePOST)
  .delete("/:userId/nodes/:nodeId", isAuthenticated, deleteNodeDELETE)
  .get("/:userId/folders", getUserFoldersGET)
  .get("/:userId/folders/:nodeId", getUserFolderContentGET)
  .get("/:userId/folder-tree", getUserFolderTreeGET);

export default usersRouter;
