import express from "express"
import bodyparser from "body-parser"
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import product from "./models/product.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";



let app = express()

app.use(bodyparser.json());
app.use((req,res,next)=>{
    let token = req.header("authorization")
    
    if (token !=null) {
        token = token.replace("Bearer ","");

       jwt.verify(token,"kv-seceret 89!",
       (err,decoded) => {
        if (!err) {
        req.user = decoded;
        }
       }) 
    }
   next() 
});

let mongoUrl = "mongodb+srv://Thilina:1234@cluster0.l2kki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl)

let connection = mongoose.connection 
connection.once("open",()=> {
console.log("MongoDB connection established successfully")
})
 

app.use("/api/users",userRouter)
app.use("/api/products",productRouter)

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})