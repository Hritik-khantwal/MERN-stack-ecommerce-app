import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFilterController,
  productListController,
  productPaymentController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateAverageRatingController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

// router object
const router = express.Router();

// routes

// CRUD oeprations started -------------
// CREATE Product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// UPDATE product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// GET products
router.get("/get-product", getProductController);

// get single product
router.get("/get-product/:slug", getSingleProductController);

// get photo
router.get("/product-photo/:pid", productPhotoController);

// DELETE Product
router.delete("/delete-product/:pid", deleteProductController);

// CRUD oeprations ended -------------

// filter product
router.post("/product-filter", productFilterController);

// product count for pegination
router.get("/product-count", productCountController);

// product per page
router.get("/product-list/:page", productListController);

// serach product
router.get("/search/:keyword", searchProductController);

// similar product
router.get("/related-product/:pid/:cid", relatedProductController);

// payment route
router.post(
  "/create-checkout-session",
  requireSignIn,
  productPaymentController
);

// update average rating
router.put("/update-rating/:pid", updateAverageRatingController);

export default router;
