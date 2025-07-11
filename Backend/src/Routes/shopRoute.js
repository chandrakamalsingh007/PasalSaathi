import express from "express";
import {loginUser,registerShop} from "../Controller/shopController.js";

const shopRouter = express.Router();

shopRouter.post("/register",registerShop)
shopRouter.post("/login",loginUser);

export default shopRouter;