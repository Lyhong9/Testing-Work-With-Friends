const { Op } = require("sequelize");
const { Brand } = require("../models");
const {logError} = require("../middleware/logError");
const buildPhotoPath = (file) => {
  if (!file) {
    return null;
  }
  return `/image/${file.filename}`;
};


const getOneBrand = async (req, res) => {
  try{
    const { search } = req.query;
    if(search){
      const brand = await Brand.findOne({
        where:{
          name:{
            [Op.like]: `%${search}%`
          }
        }
      })
      return res.json({
        success: true,
        massage: "success",
        brand: brand,
      });
    }
    const brand = await Brand.findAll();
    res.json({
      success: true,
      massage: "success",
      brand: brand,
    })
  }catch(err){
    logError("getOneBrand", err, res);
  }
  
}
const getBrand = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (keyword) {
      const brand = await Brand.findAll({
        where: {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
      });
      return res.json({
        massage: "success",
        brand: brand,
      });
    }

    const brand = await Brand.findAll();

    res.json({
      success: true,
      massage: "success",
      brand: brand,
    });
  } catch (error) {
    logError("getBrand", error, res);
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, status, description } = req.body;
    const file = req.files?.[0]; // optional uploaded file
    const image = buildPhotoPath(file);

    // Validate required fields
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Brand name is required" });
    }
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Brand status is required" });
    }
    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Brand description is required" });
    }

    // Create brand
    const brand = await Brand.create({
      name,
      status,
      description,
      image: image,
    });

    res.json({ success: true, message: "success", brand });
  } catch (error) {
    logError("createBrand", error, res);
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id, name, description, status } = req.body;
    const file = req.files?.[0]; // optional uploaded file
    const image = file ? buildPhotoPath(file) : null;

    // Validate required fields
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Brand id is required" });
    }
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Brand name is required" });
    }
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Brand status is required" });
    }
    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Brand description is required" });
    }

    // Check if brand exists
    const brandExists = await Brand.findOne({ where: { id } });
    if (!brandExists) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    // Update brand
    const brand = await Brand.update(
      {
        name: name || brandExists.name,
        status: status || brandExists.status,
        description: description || brandExists.description,
        image: image || brandExists.image,
      },
      { where: { id } }
    );

    res.json({ success: true, message: "success", brand });
  } catch (error) {
    logError("updateBrand", error, res);
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.destroy({ where: { id } });
    res.json({
      success: true,
      massage: "success",
      brand: brand,
    });
  } catch (error) {
    logError("deleteBrand", error, res);
  }
};

module.exports = {
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getOneBrand
};
