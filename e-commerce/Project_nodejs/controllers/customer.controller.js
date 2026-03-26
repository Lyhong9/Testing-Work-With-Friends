const { Op } = require("sequelize");
const { Customer, Address, sequelize } = require("../models");
const { logError } = require("../middleware/logError");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
// ==============================
// Helper: Build Image Path
// ==============================
const buildPhotoPath = (file) => {
  if (!file) return null;
  return `/image/${file.filename}`;
};

// ==============================
// GET ONE / SEARCH CUSTOMER
// ==============================
const getOneCustomer = async (req, res) => {
  try {
    const { search } = req.query;

    if (search) {
      const customer = await Customer.findOne({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      });

      return res.json({
        success: true,
        message: "success",
        customer,
      });
    }

    const customers = await Customer.findAll();

    res.json({
      success: true,
      message: "success",
      customers,
    });
  } catch (err) {
    logError("getOneCustomer", err, res);
  }
};

// ==============================
// GET ALL CUSTOMER / SEARCH
// ==============================
const getCustomer = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (keyword) {
      const customers = await Customer.findAll({
        where: {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
      });

      return res.json({
        success: true,
        message: "success",
        customers,
      });
    }

    const customers = await Customer.findAll({
      include: [
        {
          model: Address,
          as: "addresses",
          attributes: ["id", "street", "city", "state", "zipCode", "country"],
        },
      ],
    });

    res.json({
      success: true,
      message: "success",
      customers,
    });
  } catch (error) {
    logError("getCustomer", error, res);
  }
};

const Register = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, email, password, phone } = req.body;
    const file = req.files?.[0];
    const image = buildPhotoPath(file);

    // Validation
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Customer name is required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Customer email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Customer password is required" });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Customer phone is required" });
    }

    const existingEmail = await Customer.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    const customer = await Customer.create(
      {
        name,
        email,
        password: hashedPassword,
        phone,
        image: image || null,
      },
      { transaction: t },
    );

    await t.commit();

    res.json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    await t.rollback();
    logError("createCustomer", error, res);
  }
};

// ==============================
// LOGIN  CUSTOMER
// ==============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check customer
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compareSync(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password incorrect!",
      });
    }

    const customerObj = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      image: customer.image,
    };

    // 4. Response
    res.json({
      success: true,
      message: "Login success",
      customer: customer,
      access_token: await getAccessToken({ ...customerObj }),
    });
  } catch (error) {
    t.rollback();
    logError("login", error, res);
  }
};

const getAccessToken = async (paramData) => {
  const KeyToken =
    "afasdfasdfsakdfjdsfsfhasfsdfjk230798547-25-749587rtonaoagbhagheq4tw45agbgartj";
  const access_token = await jwt.sign({ data: paramData }, KeyToken, {
    expiresIn: "1d",
  });
  return access_token;
};

// ==============================
// UPDATE CUSTOMER
// ==============================
const updateCustomer = async (req, res) => {
  try {
    const { id, name, email, password, phone } = req.body;
    const file = req.files?.[0];
    const image = file ? buildPhotoPath(file) : null;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Customer id is required" });
    }

    const customer = await Customer.findOne({ where: { id } });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const ProtectedFieldsEmail = customer.email;

    if (ProtectedFieldsEmail !== email) {
      return res.status(400).json({
        success: false,
        message: "Customer email is protected",
      });
    }
    const customerView = await Customer.update(
      {
        name: name || customer.name,
        email: email || customer.email,
        password: password || customer.password,
        phone: phone || customer.phone,
        image: image || customer.image,
      },
      { where: { id } },
    );

    res.json({
      success: true,
      message: "Customer updated successfully",
      customer: customerView,
    });
  } catch (error) {
    logError("updateCustomer", error, res);
  }
};

// ==============================
// DELETE CUSTOMER
// ==============================
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Customer.destroy({
      where: { id },
    });

    res.json({
      success: true,
      message: "Customer deleted successfully",
      deleted,
    });
  } catch (error) {
    logError("deleteCustomer", error, res);
  }
};

const otpStore = new Map();
const OTP_EXPIRE_MS = 5 * 60 * 1000;
const VERIFIED_EXPIRE_MS = 10 * 60 * 1000;

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const uesr = await UserActivation.findOne({
      where: {
        email: email,
      },
    });

    if (!uesr) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Vothanarern@gmail.com",
        pass: "oafy ihyj qlzt qrzm", // Use environment variable for security
      },
    });

    const mailOptions = {
      from: "Vothanarern@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    otpStore.set(email, {
      otp: otp.toString(),
      otpExpireAt: Date.now() + OTP_EXPIRE_MS,
      verified: false,
      verifiedExpireAt: null,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    logError("sendOTP", error, res);
  }
};

const verifyOtp = async (req, res) => {
  try{
    const { email, otp } = req.body;

    if(!(email) || !(otp)){
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await UserActivation.findOne({ where: { email: email } });
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpData = otpStore.get(email);
    if(!otpData){
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP",
      });
    }

    if(Date.now() > otpData.otpExpireAt){
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    if(otpData.otp !== otp.toString()){
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    otpStore.set(email, {
      ...otpData,
      verified: true,
      verifiedExpireAt: Date.now() + VERIFIED_EXPIRE_MS,
    });

    res.json({
      success: true,
      message: "OTP verified successfully",
    })
  }catch(error){
    logError("verifyOtp", error, res);
  }
};

const resetPassword = async (req, res) => {
  try{
    const { email, newPassword } = req.body;

    if(!(email) || !(newPassword)){
      return res.status(400).json({
        success: false,
        message: "Email and newPassword are required",
      });
    }

    const user = await User.findOne({ where: { email: email } });
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpData = otpStore.get(email);
    if(!otpData || !otpData.verified){
      return res.status(400).json({
        success: false,
        message: "OTP is not verified",
      });
    }

    if(!otpData.verifiedExpireAt || Date.now() > otpData.verifiedExpireAt){
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update({password: hashedPassword})
    otpStore.delete(email);

    res.json({
      success: true,
      message: "Password reset successfully",
    })
  }catch(error){
    logError("resetPassword", error, res);
  }
};

// ==============================
// EXPORT
// ==============================
module.exports = {
  getCustomer,
  getOneCustomer,
  Register,
  updateCustomer,
  deleteCustomer,
  login,
  sendOTP,
  verifyOtp,
  resetPassword,
};
