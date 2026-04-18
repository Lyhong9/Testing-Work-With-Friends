const { Role, Permission , RolePermission, sequelize} = require("../models");
const { logError } = require("../middleware/logError");
const { Op } = require("sequelize");


const getRole = async (req, res) => {
  try {

    const {search} = req.query;

    if(search){
        const role = await Role.findAll({
            where: {
                name:{
                    [Op.like]: `%${search}%`
                }
            },
            include: [
                {
                    model: Permission,
                    as : "permissions",
                    attributes: ["id", "name", "description"],
                    through: { attributes: [] },
                }
            ],
        })

        return res.json({
            success: true,
            message: "Role fetched successfully",
            data: role
        })
    }
    const role = await Role.findAll(
        {include: [
          {
            model: Permission,
            as: "permissions",
            attributes: ["id", "name", "description"],
            through: { attributes: [] },
          },
        ],}
    );
    return res.json({
      success: true,
      message: "Role fetched successfully",
      data: role,
    });
  } catch (err) {
    logError("getRole", err, res);
  }
};


const createRole = async (req, res) => {
  try {
    const t = await sequelize.transaction();
    const { name, description, roleId, permissionId  } = req.body;
    if(!name){
        return res.status(400).json({
            success: false,
            message: "Role name is required"
        })
    }
    const role = await Role.create({
      name,
      description,
    }, { transaction: t });

    await RolePermission.create({
        roleId,
        permissionId
    }, { transaction: t })
    
    return res.json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (errr) {
    logError("createRole", errr, res); 
  }
};

const updateRole = async (req, res) => {
  try {
    const {id, name, description } = req.body;
    const role = await Role.update(
      {
        name,
        description,
      },
      { where: { id } }
    );
    return res.json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (errr) {
    logError("updateRole", errr, res);
  }
};
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.destroy({ where: { id } });
    return res.json({
      success: true,
      message: "Role deleted successfully",
      data: role,
    });
  } catch (errr) {
    logError("deleteRole", errr, res);
  }
};

module.exports = { getRole, createRole, updateRole, deleteRole };
