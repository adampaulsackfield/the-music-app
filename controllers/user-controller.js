const User = require('../models/user-model');

const addUser = async (req,res,next) =>{
    console.log(req);
    try {
        let  newUser = {username: req.body.username};
        let savedUser = await User.create(newUser);
        res.status(201).send({success: true, data: savedUser});
    } catch {
        res.status(404).send({success: false, data: "User not found."})
    }
}

const getUsers = async (req,res,next) =>{
    try{
        let allUsers = await User.find();
        res.status(200).send({success: true, data: allUsers})
    } catch {
        res.status(400).send({success: false, data: "Something went wrong"})
    }
}

const getUserById = async (req, res, next)=>{
    try{
        const {id} = req.params;
        let userToSend = await User.findById(id);
        if(userToSend != null){
            res.status(200).send({success: true, data: userToSend})
        } else {
            throw new Error('User does not exist.')
        }
        
    } catch {
        res.status(404).send({success: false, data: "User not found"})
    }
}

const updateUserById = async (req, res, next)=>{
    try{
        const {id} = req.params;
        const {username, password, email, displayName} = req.body
        let user = await User.findById(id);
        let userToUpdate = await User.findByIdAndUpdate(id, {
        username: username == null ? user.id : username,
        password: password == null ? user.password : password,
        email: email == null ? user.email: email,
        displayname: displayName == null ? user.displayName: displayName}, {returnOriginal : false});
        if(userToUpdate != null){
            res.status(200).send({success: true, data: userToUpdate})
        } else {
            throw new Error('User does not exist.')
        }
        
    } catch {
        res.status(404).send({success: false, data: "Could not update"})
    }
}

const deleteUserById = async (req, res, next)=>{
    try{
        const {id} = req.params;
        let userToDelete = await User.findById(id);
        if(userToDelete != null){
            await User.findByIdAndDelete(id);
            res.status(200).send({success: true, data: userToDelete})
        } else {
            throw new Error('User does not exist.')
        }
        
    } catch {
        res.status(400).send({success: false, data: "Could not delete"})
    }
}

module.exports = {addUser, getUsers, getUserById, updateUserById, deleteUserById};

