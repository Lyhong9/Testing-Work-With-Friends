const express = require("express");
const db = require("./models");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync database
db.sequelize.sync().then(() => {
  console.log("Database synced");
}).catch((err) => {
  console.error("Error syncing database:", err);
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});