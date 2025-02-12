import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));
app.use(cookieParser());

// Tring to start server
// app.get("/",(req,res)=>{
//     res.send("Welcome to IsIyckan Designs")
// })



// Routes
app.use("/api/v1/auth",authRoutes);
//  Auth is user here
app.use("/api/v1/", productRoutes);
app.use("/api/v1/orders", orderRoutes);


export default app;