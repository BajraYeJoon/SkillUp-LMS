import { Router } from "express";

import { registerUser } from "../controller/user.controller";

const useRouter: Router = Router();

useRouter.post("/register", registerUser);

export default useRouter;
