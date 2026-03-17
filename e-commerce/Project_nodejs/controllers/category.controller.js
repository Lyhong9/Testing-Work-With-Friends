const { Op } = require("sequelize");
const { Category } = require("../models");

const getCategories = async (req, res) => {
  const { keyword, status } = req.query;
  if (keyword) {
    const categories = await Category.findAll({
      where: {
        Name: {
          [Op.like]: `%${keyword}%`,
        },
      },
    });
    return res.json({
      massage: "success",
      categories: categories,
    });
  }

  if(status){
    const categories = await Category.findAll({
      where: {
        status: status,
      },
    });
    return res.json({
      massage: "success",
      categories: categories,
    });
  }

  const categories = await Category.findAll();

  res.json({
    massage: "success",
    categories: categories,
  });
};

const createCategory = async (req, res) => {
  const { name, description, status } = req.body;
  const category = await Category.create({
    name,
    description,
    status,
  });
  res.json({
    massage: "success",
    category: category,
  });
};

const updaetCategory = async (req, res) => {
  const { id, name, description, status } = req.body;
  const category = await Category.update(
    { name, description, status },
    { where: { id } },
  );
  res.json({
    massage: "success",
    category: category,
  });
};
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const category = await Category.destroy({ where: { id } });
    res.json({
      massage: "success",
      category: category,
    });
};

module.exports = {
  getCategories,
  createCategory,
  updaetCategory,
  deleteCategory,
};
