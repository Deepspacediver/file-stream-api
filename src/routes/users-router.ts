import { Router } from "express";
import {
  createUserPOST,
  deleteNodeDELETE,
  getUserFoldersGET,
  getUserFolderTreeGET,
  updateNodeNamePOST,
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
  .post("/:userId/nodes/:nodeId", isAuthenticated, updateNodeNamePOST)
  .delete("/:userId/nodes/:nodeId", isAuthenticated, deleteNodeDELETE)
  .get("/:userId/folders", getUserFoldersGET)
  .get("/:userId/folder-tree", getUserFolderTreeGET);

export default usersRouter;
