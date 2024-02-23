import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import categoryRoutes from "./routes/CategoryRoutes.js";
import productRoutes from "./routes/productRoute.js";
import ratingRoutes from "./routes/ratingRoute.js";
import path from "path";
<<<<<<< HEAD
import { fileURLToPath } from "url";
=======
import {fileURLToPath} from "url";
>>>>>>> eb6ec2a47baa16fe4ac05254ff578538c97ece4a

// configure env
dotenv.config();

// databse config
connectDB();

//esmodule fix
<<<<<<< HEAD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
=======
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
>>>>>>> eb6ec2a47baa16fe4ac05254ff578538c97ece4a

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

// PORT
const PORT = process.env.PORT || 8080;

// server listen
app.listen(PORT, () => {
  console.log(`server is working at port ${PORT}`.bgCyan.white);
});
