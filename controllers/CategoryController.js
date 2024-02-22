import slugify from "slugify";
import categoryModels from "../models/categoryModels.js";

// CREATE CATEGORY Controller
export const createCategoryController = async (req, res) => {
  try {
    // destructure data
    const { name } = req.body;
    // authenticate
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }
    // check existing category
    const existingCategory = await categoryModels.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }
    // save category
    const category = await new categoryModels({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};

// UPDATE CATEGORY Controller
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModels.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating Category",
    });
  }
};

// GET ALL categories Controller
export const categoriesController = async (req, res) => {
  try {
    const categories = await categoryModels.find({});
    res.status(200).send({
      success: true,
      message: "All Categories list",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// GET SINGLE Category Controller
export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModels.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single category",
    });
  }
};

// DELETE Category Controller
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModels.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting category",
    });
  }
};
