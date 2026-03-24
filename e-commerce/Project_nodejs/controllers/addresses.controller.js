const { Address, sequelize, Customer } = require("../models");
const { Op } = require("sequelize");
const { logError } = require("../middleware/logError");

// ==============================
// GET ALL ADDRESSES (with optional search)
// ==============================
const getAddresses = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (keyword) {
      const addresses = await Address.findAll({
        where: {
          [Op.or]: [
            { street: { [Op.like]: `%${keyword}%` } },
            { city: { [Op.like]: `%${keyword}%` } },
            { state: { [Op.like]: `%${keyword}%` } },
            { country: { [Op.like]: `%${keyword}%` } },
          ],
        },
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email"],
          },
        ]
      });
      return res.json({
        success: true,
        message: "Get all addresses",
        address: addresses,
      });
    }

    const addresses = await Address.findAll({
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email"  , "phone"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Get all addresses",
      data: addresses,
    });
  } catch (error) {
    logError("getAddresses", error, res);
  }
};

// ==============================
// GET ONE ADDRESS BY ID
// ==============================
const getOneAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findByPk(id, {
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "success",
      data: address,
    });
  } catch (error) {
    logError("getOneAddress", error, res);
  }
};

const createAddresses = async (req, res) => {
    const t = await sequelize.transaction();
  try {
    const { customerID, street, city, state, zipCode, country } = req.body;

    if (!customerID)
      return res.status(400).json({ message: "Customer ID is required" });

    const addresses = await Address.create({
      customerID,
      street,
      city,
      state,
      zipCode,
      country,
    }, { transaction: t });

    await t.commit();
    res.status(200).json({
      message: "Addresses created successfully",
      success: true,
      addresses: addresses,
    });
  } catch (error) {
    t.rollback();
    logError("createAddresses", error, res);
  }
};

const updateAddresses = async (req, res) => {
  try {
    const { id, customer_id, street, city, state, zipCode, country } = req.body;
    if (!id) return res.status(400).json({ message: "Address ID is required" });
    
    const addresses = await Address.update(
      {
        customer_id,
        street,
        city,
        state,
        zipCode,
        country,
      },
      {
        where: { id },
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email"],
          },
        ],
      },
    );

    res.status(200).json({
      message: "Addresses updated successfully",
      success: true,
      addresses: addresses,
    });
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteAddresses = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Address ID is required" });
    const addresses = await Address.destroy({ where: { id } });
    res.status(200).json({
      message: "Addresses deleted successfully",
      success: true,
      addresses: addresses,
    });
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAddresses, createAddresses, updateAddresses, deleteAddresses,  getOneAddress };
