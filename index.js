import express from "express"
import bodyparser from "body-parser"
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import product from "./models/product.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import reviewRouter from "./routes/reviewRouter.js";


dotenv.config();

let app = express()

app.use(bodyparser.json());
app.use((req,res,next)=>{
    let token = req.header("authorization")
    
    if (token !=null) {
        token = token.replace("Bearer ","");

       jwt.verify(token,process.env.JWT_SECRET,
       (err,decoded) => {
        if (!err) {
        req.user = decoded;
        }
       }) 
    }
   next() 
});

let mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl)

let connection = mongoose.connection 
connection.once("open",()=> {
console.log("MongoDB connection established successfully")
})
 

app.use("/api/users",userRouter);
app.use("/api/products",productRouter);
app.use("/api/reviews", reviewRouter);

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

/// admin thilinachamaraj@gmail.com Test123
///Customer johndoe@example.com securePassword123