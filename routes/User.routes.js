const express = require('express');
const userRouter = express.Router();
const {
	createUser,
	getUsers,
	getUserById,
	getUserProfile,
	updateUser,
	deleteUser,
	loginUser,
	followUser,
	unfollowUser,
} = require('../controllers/user.controller');

const protectedRoute = require('../middleware/auth.middleware');

userRouter.route('/').post(createUser).get(getUsers);

userRouter
	.route('/profile')
	.get(protectedRoute, getUserProfile)
	.put(protectedRoute, updateUser)
	.delete(protectedRoute, deleteUser);

userRouter.route('/:id').get(protectedRoute, getUserById);
userRouter.route('/:id/follow').get(protectedRoute, followUser);
userRouter.route('/:id/unfollow').get(protectedRoute, unfollowUser);
userRouter.route('/login').post(loginUser);

module.exports = userRouter;
