const express = require('express');
const userRouter = express.Router();
const {
	addUser,
	getUsers,
	getUserProfile,
	updateUserById,
	deleteUserById,
	loginUser,
} = require('../controllers/User.controller');
const protectedRoute = require('../middleware/auth.middleware');

userRouter.route('/').post(addUser).get(getUsers);
userRouter
	.route('/profile')
	.get(protectedRoute, getUserProfile)
	.put(updateUserById)
	.delete(deleteUserById);
userRouter.route('/login').post(loginUser);

module.exports = userRouter;
