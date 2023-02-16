const express = require('express');
const userRouter = express.Router();
const {
	addUser,
	getUsers,
	getUserProfile,
	updateUser,
	deleteUser,
	loginUser,
} = require('../controllers/User.controller');
const protectedRoute = require('../middleware/auth.middleware');

userRouter.route('/').post(addUser).get(getUsers);
userRouter
	.route('/profile')
	.get(protectedRoute, getUserProfile)
	.put(protectedRoute,updateUser)
	.delete(protectedRoute,deleteUser);
userRouter.route('/login').post(loginUser);

module.exports = userRouter;
