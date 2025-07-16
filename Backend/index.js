import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import shopRouter from "./src/Routes/shopRoute.js";
import productRouter from "./src/Routes/productRoute.js";
import customerRouter from "./src/Routes/customerRoute.js";
dotenv.config();

// app config
const app = express();
const port = 3000 ;
 
// middleware
app.use(express.json());
app.use(cors(
    {
        origin: "*",
    }
))

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("DataBase is connected");
}).catch((err) => {
    console.log(err.message);
    console.log("Something error on database connection");
})

//api endpoints
app.use("/api/shop",shopRouter); //http://localhost:3000/api/shop
app.use("/api/product",productRouter)
app.use("/api/customer",customerRouter);

app.get("/", (req,res)  => {
    res.send("API working");
})

app.listen(port, () =>{
    console.log(`Server Started on http://localhost:${port}`)
})