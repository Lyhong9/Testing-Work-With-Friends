const {Permission} = require("../models");
const { logError } = require("../middleware/logError");
const { Op } = require("sequelize");
const getPermission = async (req, res) => {
    try{
        const {search} = req.query;
        if(search){
            const permission = await Permission.findAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }
            })
            return res.json({
                success: true,
                message: "Permission fetched successfully",
                data: permission
            })
        }
        const permission = await Permission.findAll();
        return res.json({
            success: true,
            message: "Permission fetched successfully",
            data: permission
        })
    }catch(errr){
        logError("getPermission", errr, res);
    }
};

module.exports = { getPermission };