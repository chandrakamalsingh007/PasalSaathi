import express from "express";
import { isLoggedIn } from "../Middleware/authMiddleware.js";
import { addProduct, updateProduct, deleteProduct } from "../Controller/productController.js";
import upload from "../Middleware/multerMiddleware.js";

const productRouter = express.Router();

productRouter.post("/add",isLoggedIn,upload.single("image"),addProduct);
productRouter.put("/update/:id",isLoggedIn,upload.single("image"),updateProduct)
productRouter.delete("/delete/:id",isLoggedIn,deleteProduct);





export default productRouter;