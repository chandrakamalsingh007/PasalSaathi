import express from "express";
import {
  addCustomer,
  getCustomerById,
  getAllCustomers,
  deleteCustomer
} from "../Controller/customerController.js";
import { isLoggedIn } from "../Middleware/authMiddleware.js";

const customerRouter = express.Router();

customerRouter.post("/add", isLoggedIn, addCustomer);
customerRouter.post("/list", isLoggedIn, getAllCustomers);
customerRouter.post("/:hashId", isLoggedIn, getCustomerById);
customerRouter.delete("/delete/:hashId", isLoggedIn,deleteCustomer);

export default customerRouter;
