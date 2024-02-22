import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import StripeModule from "stripe";
import orderModel from "../models/orderModel.js";

const stripe = new StripeModule(
  "sk_test_51OY2dZSCN0SH9m1qfcWpeSuudT9WwvPJ7PmCBExrVYcB1DViqR1PGbreOChhmrM9J8WKoTx3Kk5lgCKSkiuDwmhn004YgBNUbt"
);

// CREATE product controller
export const createProductController = async (req, res) => {
  try {
    // destructuring from express-formidable package
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less then 1 mb" });
    }
    // create copy of the product
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    // now adding photo to the products object
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    // save product
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating Product",
    });
  }
};

// GET products controller
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category") //now all the data of category will be shown instead of just category id
      .select("-photo") //will not fetch the photo here
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while getting the product",
    });
  }
};

// GET single product controller
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "single product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single product",
    });
  }
};

// GET product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting product photo",
    });
  }
};

// DELETE product controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting the product",
    });
  }
};

// UPDATE product controller
export const updateProductController = async (req, res) => {
  try {
    // destructuring from express-formidable package
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 100000:
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less then 1 mb" });
    }
    // create copy of the product
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    // now adding photo to the products object
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    // save product
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating Product",
    });
  }
};

// product Filter Controller
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering product",
      error,
    });
  }
};

// product Count Controller
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

// product List Controller
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1; // var page bcz getting by page in its api
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page controller ",
      error,
    });
  }
};

// search Product Controller
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search product api",
      error,
    });
  }
};

// related Product Controller
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related product",
      error,
    });
  }
};

// product Payment Controller
export const productPaymentController = async (req, res) => {
  try {
    const { products } = req.body;
    const { _id: userId } = req.user;

    const customer = await stripe.customers.create({
      email: userId?.email,
      name: userId?.name,
      address: {
        line1: "babina",
        city: "pauri garhwal",
        postal_code: "246129",
        state: "uttarakhand",
        country: "india",
      },
    });

    const lineItems = products.map((p) => ({
      price_data: {
        currency: "INR",
        product_data: {
          name: p.name,
        },
        unit_amount: p.price * 100,
      },
      quantity: p.orderedQuantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: lineItems,
      mode: "payment",
      success_url: "http://127.0.0.1:3000/success",
      cancel_url: "http://127.0.0.1:3000/cancel",
    });
    //  set details in orderModel
    // calculate total amount
    const totalPayment = lineItems.reduce(
      (total, item) =>
        total + (item.price_data.unit_amount * item.quantity) / 100,
      0
    );
    if (session) {
      const totalPaid = totalPayment + 40;
      const order = new orderModel({
        product: products,
        payment: totalPaid,
        buyer: userId,
      });

      // Save the order to your database
      await order.save();

      res.status(200).send({
        success: true,
        message: "Payment Successfull",
        ID: session.id,
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Error in payment checkout",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Payment checkout",
      error,
    });
  }
};

// update AverageRating Controller
export const updateAverageRatingController = async (req, res) => {
  try {
    const productId = req.params.pid;
    const { avgRating } = req.body;
    const product = await productModel.findById(productId);

    if (!product) {
      res.status(404).send({
        success: false,
        message: "Rating not updated",
      });
    }
    product.averageRating = avgRating;

    await product.save();

    res.status(200).send({
      success: true,
      message: "Rating updated Successfully",
      averageRating: avgRating,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating avg rating",
      error,
    });
  }
};
