const express = require('express');
const userRouter = express.Router();
const {addUser, getUsers, getUserById, updateUserById, deleteUserById} = require('../controllers/user-controller');


userRouter.route("/").post(addUser).get(getUsers);
userRouter.route("/:id").get(getUserById).put(updateUserById).delete(deleteUserById);


module.exports = userRouter;