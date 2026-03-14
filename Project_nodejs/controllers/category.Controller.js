const { where, Op } = require("sequelize");
const { Category } = require("../models");

const getCategory = async (req, res) => {
  try {

    const {category, status} = req.query;
    if(category){
        const data = await Category.findAll({
            where: {
                [Op.or]:[
                    {name : {[Op.like]: `%${category}%`}}
                ]
            }
        });

        if(!category){
            return  res.json({
                massesag: "category not found!"
            })
        }

        return  res.json({
            data,
            massesag: "search success!"
        })
    }





    const data = await Category.findAll();
    return res.json({
      data: data,
      message: "success"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { getCategory };