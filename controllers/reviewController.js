import reviewModel from "../models/ratingModel.js";

// create review controller
export const createReviewController = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const { _id: userId } = req.user;

    const review = new reviewModel({
      rating,
      comment,
      user: userId,
      product: productId,
    });
    await review.save();
    res.status(200).send({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while creating review",
      error,
    });
  }
};

// get Review Controller
export const getReviewController = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({ product: req.params.productId })
      .populate("user", "name");
    res.status(200).send({
      success: true,
      message: "Reviews retrieved successfully",
      reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting reviews",
      error,
    });
  }
};
