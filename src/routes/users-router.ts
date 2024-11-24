import { Router } from "express";
import {
  createUserPOST,
  getUserDataWithNodeTreeGET,
  getUserFolderGET,
} from "../controllers/user-controller.js";

const usersRouter = Router();

usersRouter
  .get("/:userId", getUserDataWithNodeTreeGET)
  .post("/", createUserPOST)
  .get("/:userId/folders", getUserFolderGET);

export default usersRouter;
