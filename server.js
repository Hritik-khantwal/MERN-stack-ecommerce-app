import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
// import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import categoryRoutes from "./routes/CategoryRoutes.js";
import productRoutes from "./routes/productRoute.js";
import ratingRoutes from "./routes/ratingRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// configure env
dotenv.config();

// PORT
const PORT = process.env.PORT || 8080;

// databse config
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`.bgRed.white);
    process.exit(1);
  }
};

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/rating", ratingRoutes);

// rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// server listen
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is working at port ${PORT}`.bgCyan.white);
  });
});

// server listen
// app.listen(PORT, () => {
//   console.log(`server is working at port ${PORT}`.bgCyan.white);
// });
