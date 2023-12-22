import { Router } from "express";

import { activateUser, registerUser } from "../controller/user.controller";

const userRouter: Router = Router();

userRouter.post("/register", registerUser);

userRouter.post("/activate-user", activateUser);

export default userRouter;
