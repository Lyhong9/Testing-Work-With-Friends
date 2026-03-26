const { User, UserRole, Role, Permission, sequelize } = require("../models");
const { Op } = require("sequelize");
const { logError } = require("../middleware/logError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        },
        include: [
          {
            model: Role,
            as: "roles",
            attributes: ["id", "name", "description"],
            through: { attributes: [] },
            include: [
              {
                model: Permission,
                as: "permissions",
                attributes: ["id", "name", "description"],
                through: { attributes: [] },
              },
            ],
          },
        ],
      });
      return res.json({
        success: true,
        message: "success", // ✅ fixed typo
        users,
      });
    }

    users = await User.findAll({
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name", "description"],
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["id", "name", "description"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    return res.json({
      success: true,
      message: "success", // ✅ fixed typo
      users,
    });
  } catch (err) {
    logError("getUsers", err, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    res.json({
      success: true,
      message: "User deleted successfully",
      deleted,
    });
  } catch (error) {
    logError("deleteUser", error, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, username, email, password, status, role_id } = req.body || {};
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
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

    if (!role_id) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const updated = await User.update(
      {
        username,
        email,
        password: hashPassword,
        status,
        role_id,
      },
      { where: { id } },
    );
    res.json({
      success: true,
      message: "User updated successfully",
      updated,
    });
  } catch (error) {
    logError("updateUser", error, res);
  }
};

const registerUser = async (req, res) => {
  try {
    const t = await sequelize.transaction();
    // ✅ prevent crash
    const { username, email, password, status, role_id } = req.body || {};

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

    if (!role_id) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10); // bcrypt.hash(password, 10);

    const user = await User.create(
      {
        username,
        email,
        password: passwordHash,
        status,
      },
      { transaction: t },
    );

    await UserRole.create(
      {
        userId: user.id,
        roleId: role_id,
      },
      { transaction: t },
    );

    await t.commit();

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

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name", "description"],
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["id", "name", "description"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password incorrect",
      });
    }

    // flatten permissions
    const permissions = [];
    user.roles.forEach((role) => {
      role.permissions.forEach((perm) => {
        permissions.push(perm);
      });
    });

    const uniquePermissions = [
      ...new Map(permissions.map((p) => [p.id, p])).values(),
    ];

    const ObjUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      permissions: uniquePermissions,
    };

    res.json({
      success: true,
      message: "success",
      user,
      access_token: await getAccessToken({ ...ObjUser }),
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

const otpStore = new Map();
const OTP_EXPIRE_MS = 10 * 60 * 1000;
const VERIFIED_EXPIRE_MS = 10 * 60 * 1000;

//send OTP to Email
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
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
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Save OTP to user or send it via email
    // Example: await sendEmail(user.email, otp);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Vothanarern@gmail.com",
        pass: "oafy ihyj qlzt qrzm", // Use environment variable for security
      },
    });

    const mailOptions = {
      from: "Vothanarern@gmail.com",
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
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
    logError("UserController", error, res);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpData = otpStore.get(email);
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP",
      });
    }

    if (Date.now() > otpData.otpExpireAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    if (otpData.otp !== otp.toString()) {
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
    });
  } catch (error) {
    logError("UserController", error, res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and newPassword are required",
      });
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpData = otpStore.get(email);
    if (!otpData || !otpData.verified) {
      return res.status(400).json({
        success: false,
        message: "OTP is not verified",
      });
    }

    if (!otpData.verifiedExpireAt || Date.now() > otpData.verifiedExpireAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP verification has expired. Please verify OTP again",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    otpStore.delete(email);

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    logError("UserController", error, res);
  }
};

module.exports = {
  getUsers,
  registerUser,
  userLogin,
  sendOTP,
  verifyOtp,
  resetPassword,
  deleteUser,
  updateUser,
};
