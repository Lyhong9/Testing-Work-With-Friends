const {UserRole} = require("../models");
const {Op} = require("sequelize");
const {logError} = require("../middleware/logError");
const invalid = require("../middleware/prevent.js")

const getUserRole = async (req, res) =>{
    try{
        const user_role = await UserRole.findAll();

        res.json({
            success: true,
            message: 'Get success',
            user_role
        })
    }catch(err){
        logError("getUserRole", err, res)
    }
}

const CreateUserRole = async (req, res) =>{
    try{
        const {user_id, role_id} = req.body
        if(!user_id){
            return res.json({
                success: false,
                message: "user_id is required",
            })
        }
        if(!role_id){
            return res.json({
                success: false,
                message: "role_id is required",
            })
        }

        const userRole = await UserRole.create({
            userId: user_id,
            roleId: role_id
        })

        res.json({
            success: true,
            message: "success",
            userRole
        })

    }catch(err){
        logError("CreateUserRole", err, res);
    }
}

const updateUserRole = async (req, res) =>{
    const {id, user_id, role_id} = req.body;
    
    if(!id){
        return res.json({
            success: false,
            message: "id is required",
        })
    }
    if(!user_id){
        return res.json({
            success: false,
            message: "user_id is required",
        })
    }
    if(!role_id){
        return res.json({
            success: false,
            message: "role_id is required",
        })
    }

    const userRole = await UserRole.update({
        userId: user_id,
        roleId: role_id
    }, {
        where: {
            id
        }
    })
}

module.exports = {
    getUserRole,
    CreateUserRole,
    updateUserRole
}