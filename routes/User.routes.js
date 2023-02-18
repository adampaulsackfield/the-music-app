// Imports
const express = require('express');
const userRouter = express.Router();

// Controller Imports
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

// Protected Route Middleware
const protectedRoute = require('../middleware/auth.middleware');

// Create User / List Users
userRouter.route('/').post(createUser).get(getUsers);

// Login User
userRouter.route('/login').post(loginUser);

// Get Current User / Update Current User / Delete Current User
userRouter
	.route('/profile')
	.get(protectedRoute, getUserProfile)
	.put(protectedRoute, updateUser)
	.delete(protectedRoute, deleteUser);

// Get User By ID
userRouter.route('/:id').get(protectedRoute, getUserById);

// Follow / Unfollow User
userRouter.route('/:id/follow').get(protectedRoute, followUser);
userRouter.route('/:id/unfollow').get(protectedRoute, unfollowUser);

module.exports = userRouter;
