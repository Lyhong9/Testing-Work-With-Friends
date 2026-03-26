const {
  getUsers,
  registerUser,
  userLogin,
  sendOTP,
  resetPassword,
  verifyOtp,
  deleteUser,
  updateUser
} = require("../controllers/users.controller");
const { validateCheck } = require("../middleware/logError");
const { body } = require("express-validator");

const validateRegister = () => {
  return [
    body("username").isString().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .isString()
      .withMessage("Password is required"),
  ];
};
const usersRoute = (app) => {
  app.get("/api/user", getUsers);
  app.post("/api/user",validateCheck, registerUser);
  app.post("/api/user/login", userLogin);
  app.post("/api/user/sendOTP", sendOTP);
  app.post("/api/user/verifyOTP", verifyOtp);
  app.post("/api/user/resetPassword", resetPassword);
  app.put("/api/user", updateUser);
  app.delete("/api/user/:id",deleteUser);
};

module.exports = usersRoute;
