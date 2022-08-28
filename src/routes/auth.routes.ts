import { Router } from "express";
import {
    loginUserController,
    logoutUserController,
    refreshController,
    registerUserController
} from "../controllers/auth.controller";


const authRouter = Router();


authRouter.post("/login", loginUserController);
authRouter.post("/register", registerUserController);
authRouter.post("/logout", logoutUserController);
authRouter.get("/refresh", refreshController);


export default authRouter;
