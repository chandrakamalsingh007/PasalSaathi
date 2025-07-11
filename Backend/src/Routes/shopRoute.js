import express from "express";
import {loginUser,registerShop} from "../Controller/shopController.js";

const shopRouter = express.Router();

userRouter.post("/register",registerShop)
userRouter.post("/login",loginUser);

export default shopRouter;