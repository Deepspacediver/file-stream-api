import { Router } from "express";
import {
  createUserPOST,
  getUserDataGET,
} from "../controllers/user-controller.js";

const usersRouter = Router();

usersRouter.get("/:userId", getUserDataGET).post("/:userId", createUserPOST);

export default usersRouter;
