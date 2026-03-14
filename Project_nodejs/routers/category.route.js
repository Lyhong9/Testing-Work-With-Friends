
const {getCategory} = require("../controllers/category.Controller")

const CategoryRoute = (app) =>{
    app.get("/api/category", getCategory);
}

module.exports ={CategoryRoute}