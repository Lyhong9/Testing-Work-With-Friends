const {User} = require("../models");
const {Op} = require("sequelize");
const logError = require("../middleware/logError");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    
const getUsers = async (req, res) =>{
    try{
        const {search} = req.query;
        const users = await User.findAll({
            where: {
                username: {
                    [Op.like]: `%${search}%`
                }
            }
        });
        res.json({
            success: true,
            message: "success",
            users: users
        });
    }catch(err){
        logError("getUsers", err, res);
    }
}

const registerUser = async (req, res) => {
    try{
        const {username, email, password, status} = req.body;
        
        if(!username){
            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }

        if(!email){
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        if(!password){
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }
        if(!status){
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const existingUser = await User.findOne({where: {email: email}});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({username, email, passwordHash, status});
        res.json({
            success: true,
            message: "success",
            user: user
        });
    }catch(err){
        logError("registerUser", err, res);
    }
}

const userLogin = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        const user = await User.findOne({where: {email: email}});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const currentPassword = user.password[0];
        const isMatch = await bcrypt.compare(password, currentPassword);
        
        const ObjUser = {
            id: user.id[0],
            username: user.username[0],
            email: user.email[0],
            status: user.status[0]
        }
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Password incorrect"
            });
        }
        res.json({
            success: true,
            message: "success",
            user: user,
            access_token: await getAccessToken(ObjUser)
        });
    }catch(err){
        logError("userLogin", err, res);
    }
}

const getAccessToken = async (paramData) => {
  const KeyToken = "afasdfasdfsakdfjdsfsfhasfsdfjk230798547-25-749587rtonaoagbhagheq4tw45agbgartj";
  const access_token = await jwt.sign({ data: paramData }, KeyToken, {
    expiresIn: "1d",
  });
  return access_token;
};

// const authenticate = async (req, res) => {
//     const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
// }
module.exports = {getUsers, registerUser, userLogin};