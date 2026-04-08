const { Op } = require("sequelize");
const { Product, Category, Brand } = require("../models");
const logError = require("../middleware/logError");

const buildPhotoPath = (file) => {
  return file ? `/image/${file.filename}` : null;
};

// ✅ GET ALL + SEARCH
const getProduct = async (req, res) => {
  try {
    const { keyword, category_id, brand_id } = req.query;

    const where = {};

    if (keyword) {
      where.name = {
        [Op.like]: `%${keyword}%`,
      };
    }

    if (category_id) {
      where.categoryId = category_id;
    }

    if (brand_id) {
      where.brandId = brand_id;
    }
    // const where = keyword ? {
    //   name: {
    //     [Op.like]: `%${keyword}%`,
    //   },
    // }
    // : {};

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: "category" },
        { model: Brand, as: "brand" },
      ],
    });

    res.json({
      success: true,
      message: "success",
      product: products,
    });
  } catch (error) {
    logError("getProduct", error, res);
  }
};

// ✅ GET ONE (optional)
const getProductOne = async (req, res) => {
  try {
    const { search } = req.query;

    const product = await Product.findOne({
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      include: [
        { model: Category, as: "category" },
        { model: Brand, as: "brand" },
      ],
    });

    res.json({
      success: true,
      message: "success",
      product,
    });
  } catch (err) {
    logError("getProductOne", err, res);
  }
};

// ✅ CREATE
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stockQuantity, categoryId, brandId } =
      req.body;
    const file = req.files?.[0];
    const image = buildPhotoPath(file);

    if (!name || !price || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stockQuantity,
      categoryId,
      brandId,
      image: image || null,
    });

    res.json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    logError("createProduct", error, res);
  }
};

// ✅ UPDATE
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, stockQuantity, categoryId, brandId } =
      req.body;
    const file = req.files?.[0];
    const image = buildPhotoPath(file);

    const existing = await Product.findByPk(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = {
      name,
      description,
      price,
      stockQuantity,
      categoryId,
      brandId,
      image: image || existing.image,
    };

    if (file) {
      updateData.image = buildPhotoPath(file);
    }

    await Product.update(updateData, { where: { id } });

    const updated = await Product.findByPk(id, {
      include: [
        { model: Category, as: "category" },
        { model: Brand, as: "brand" },
      ],
    });

    res.json({
      success: true,
      message: "Product updated",
      product: updated,
    });
  } catch (error) {
    logError("updateProduct", error, res);
  }
};

// ✅ DELETE
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (id == "") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const deleted = await Product.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    logError("deleteProduct", error, res);
  }
};






module.exports = {
  getProduct,
  getProductOne,
  createProduct,
  updateProduct,
  deleteProduct,
};
