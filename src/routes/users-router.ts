import { Router } from "express";
import {
  createUserPOST,
  getUserDataWithNodeTreeGET,
} from "../controllers/user-controller.js";

const usersRouter = Router();

usersRouter
  .get("/:userId", getUserDataWithNodeTreeGET)
  .post("/", createUserPOST);

export default usersRouter;
