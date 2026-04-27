const { Role, Permission , RolePermission, sequelize} = require("../models");
const { logError } = require("../middleware/logError");
const { Op } = require("sequelize");
const { before } = require("node:test");
const { permission } = require("node:process");


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


// create before create permission 
const createRole = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, description, permissionIds } = req.body; // Assuming permissionIds is an array
    if (!name) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Role name is required"
      });
    }
    const role = await Role.create({
      name,
      description,
    }, { transaction: t });

    // Assuming permissionIds is an array of permission IDs
    if (permissionIds && Array.isArray(permissionIds)) {
      const rolePermissions = permissionIds.map(permissionId => ({
        roleId: role.id,
        permissionId
      }));
      await RolePermission.bulkCreate(rolePermissions, { transaction: t });
    }

    await t.commit();
    return res.json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (err) {
    await t.rollback();
    logError("createRole", err, res);
  }
};

// add permission to role after create role 
const AddMorePermission = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;
    const rolePermission = await RolePermission.create({
      roleId,
      permissionId,
    });
    return res.json({
      success: true,
      message: "Permission added successfully",
      data: rolePermission,
    });
  } catch (err) {
    logError("AddMorePermission", err, res);
  }
}

// update role and permission
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
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Remove relation first
    await RolePermission.destroy({
      where: { roleId: id },
      transaction: t
    });

    // Then delete role
    const role = await Role.destroy({
      where: { id },
      transaction: t
    });

    await t.commit();

    return res.json({
      success: true,
      message: "Role deleted successfully",
      data: role,
    });

  } catch (err) {
    await t.rollback();
    logError("deleteRole", err, res);
  }
};
module.exports = { getRole, createRole, updateRole, deleteRole,  AddMorePermission };
