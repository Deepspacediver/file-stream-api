import { Router } from "express";
import { createUserPOST } from "../controllers/register-controller.js";

const registerRouter = Router();

registerRouter.post("/", createUserPOST);

export default registerRouter;
