import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebHooks } from "./controllers/orderController.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

//configs
await connectDB();
await connectCloudinary();

//multiple origins
const allowedOrigin = [
  "http://localhost:5173",
  "https://green-cart-frontend-five.vercel.app",
];

app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.get("/", (request, response) => {
  response.send("Welcome to Backend...");
});

//Router end-points
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
