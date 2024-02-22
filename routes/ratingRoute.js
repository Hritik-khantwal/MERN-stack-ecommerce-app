import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createReviewController,
  getReviewController,
} from "../controllers/reviewController.js";

// router object
const router = express.Router();

// routes

// create review
router.post("/create-review", requireSignIn, createReviewController);

// get review
router.get("/get-reviews/:productId", getReviewController);

export default router;
