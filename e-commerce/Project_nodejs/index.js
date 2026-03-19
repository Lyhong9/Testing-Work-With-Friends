const express = require("express");
const path = require("path"); // <-- Add this
const db = require("./models");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images statically at /image
app.use('/image', express.static(path.join(__dirname, 'public/image')));

// Sync database
db.sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch(err => console.error("Error syncing database:", err));

const getCategories = require("./routes/category.route");
getCategories(app);

const brandRouter = require("./routes/brand.route");
brandRouter(app);

const productRouter = require("./routes/product.route");
productRouter(app);

const usersRoute = require("./routes/users.route");
usersRoute(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});