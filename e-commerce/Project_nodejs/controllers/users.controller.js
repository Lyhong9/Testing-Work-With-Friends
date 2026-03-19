const { User, UserRole } = require("../models");
const { Op } = require("sequelize");
const { logError } = require("../middleware/logError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    if (search) {
      users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        },
        include: [
          {
            model: UserRole,
            as: "userRoles"
          },
        ]
      });
      return res.json({
        success: true,
        message: "success", // ✅ fixed typo
        users
      })
    } 

    users = await User.findAll({
        include: [
          {
            model: UserRole,
            as: "userRoles"
          }
        ]
      });

    return res.json({
      success: true,
      message: "success", // ✅ fixed typo
      users
    });

  } catch (err) {
    logError("getUsers", err, res);
  }
};

const registerUser = async (req, res) => {
  try {
    // ✅ prevent crash
    const { username, email, password, status } = req.body || {};

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "username is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hashSync(password, 10); // bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: passwordHash,
      status,
    });

    res.json({
      success: true,
      message: "success",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentPassword = user.password;
    const isMatch = await bcrypt.compareSync(password, currentPassword);

    const ObjUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
    };
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password incorrect",
      });
    }
    res.json({
      success: true,
      message: "success",
      user: user,
      access_token: await getAccessToken({...ObjUser}),
    });
  } catch (err) {
    logError("userLogin", err, res);
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

// const authenticate = async (req, res) => {
//     const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
// }
module.exports = { getUsers, registerUser, userLogin };
