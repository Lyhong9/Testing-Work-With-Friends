const {Permission} = require("../models");
const { logError } = require("../middleware/logError");
const { Op } = require("sequelize");
const getPermission = async (req, res) => {
    try{
        const {search} = req.query;
        if(search){
            const permission = await Permission.findAll({
                where: {
                    description: {
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

const createPermission = async (req, res) => {
    try{
        const {name, description} = req.body;
        const permission = await Permission.create({name, description});
        return res.json({
            success: true,
            message: "Permission created successfully",
            data: permission
        })
    }catch(errr){
        logError("createPermission", errr, res);
    }
}

const updatePermission = async (req, res) => {
    try {
        const { name, description } = req.body;
        const { id } = req.params;

        const [updatedRows] = await Permission.update(
            { name, description },
            { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        const permission = await Permission.findByPk(id);

        return res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: permission
        });

    } catch (err) {
        logError("updatePermission", err, res);
    }
};

const deletePermission = async (req, res) =>{
    try{
        const {id} = req.params;
        const permission = await Permission.destroy({where: {id}});
        return res.json({
            success: true,
            message: "Permission deleted successfully",
            data: permission
        })
    }catch(err){
        logError("deletePermission", err, res);
    }
}
module.exports = { getPermission, createPermission, updatePermission, deletePermission };