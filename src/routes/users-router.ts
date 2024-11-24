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
  .delete("/:userId/nodes/:nodeId", isAuthenticated, deleteNodeDELETE)
  .get("/:userId/folders", getUserFoldersGET);

export default usersRouter;
