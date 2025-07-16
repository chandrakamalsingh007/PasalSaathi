import express from "express";
import {
  addCustomer,
  getCustomerById,
  getAllCustomers,
} from "../Controller/customerController.js";
import { isLoggedIn } from "../Middleware/authMiddleware.js";

const customerRouter = express.Router();

customerRouter.post("/add", isLoggedIn, addCustomer);
customerRouter.post("/list", isLoggedIn, getAllCustomers);
customerRouter.post("/:hashId", isLoggedIn, getCustomerById);

export default customerRouter;
