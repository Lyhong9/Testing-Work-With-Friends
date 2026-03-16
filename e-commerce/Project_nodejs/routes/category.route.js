const {get} = require('../controllers/category.controller')
const categoryRouter  = (app) => {
    app.get("api/category", get);
}

module.exports = categoryRouter