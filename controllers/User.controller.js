// Helpers
const comparePassword = require('../helpers/compare-password');
const generateToken = require('../helpers/generate-jwt');
const hashPassword = require('../helpers/hash-password');

// Models
const User = require('../models/User.model');

// Validate Password Helper
const validatePassword = async (userId, candidatePassword) => {
	// Find User By ID - So we can get the password to compare
	const user = await User.findById(userId).select('+password');

	if (!user) {
		return false;
	}

	// Verify Password
	const isValid = await comparePassword(candidatePassword, user.password);

	if (!isValid) {
		return false;
	}

	return true;
};

// METHOD    - POST
// ENDPOINT  - /api/users
// BODY      - { username, displayName, email, password }
const createUser = async (req, res, next) => {
	try {
		if (
			!req.body.username ||
			!req.body.displayName ||
			!req.body.email ||
			!req.body.password
		) {
			throw new Error('Missing required fields');
		}

		let user = req.body;

		// Hash Password
		user.password = await hashPassword(user.password);

		const savedUser = await User.create(user);

		return res.status(201).send({ success: true, data: savedUser });
	} catch (error) {
		next({ status: 400, message: error.message });
	}
};

// METHOD    - POST
// ENDPOINT  - /api/users/login
// BODY      - { email, password }
const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Find User By Email - Need to select the password, as it doesn't return by default
		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			throw new Error('Invalid login credentials');
		}

		// Verify Password
		const isValid = await comparePassword(password, user.password);

		if (!isValid) {
			throw new Error('Invalid login credentials');
		}

		// Generate JWT
		const token = await generateToken(user.id);

		return res.status(200).send({ success: true, data: token });
	} catch (error) {
		next({ status: 401, message: error.message });
	}
};

// METHOD    - GET
// ENDPOINT  - /api/users
// TODO Should this be protected
const getUsers = async (req, res, next) => {
	try {
		const users = await User.find();

		return res.status(200).send({ success: true, data: users });
	} catch (error) {
		next({ status: 400, message: error.message });
	}
};

// METHOD    - GET
// ENDPOINT  - /api/users/:id
// HEADERS   - { 'authorization': 'Bearer TOKEN' }
// PROTECTED - true
const getUserById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		if (!user) {
			throw new Error('User not found');
		}

		return res.status(200).send({ success: true, data: user });
	} catch (error) {
		next({ status: 400, message: error.message });
	}
};

// METHOD    - GET
// ENDPOINT  - /api/users/profile
// HEADERS   - { 'authorization': 'Bearer TOKEN' }
// PROTECTED - true
const getUserProfile = async (req, res, next) => {
	try {
		// User ID will be in the req if the user is authenticated
		const { id } = req.user;

		// Find the user and populate followers / following
		const user = await User.findById(id)
			.populate('followers', 'displayName')
			.populate('following', 'displayName');

		if (!user) {
			throw new Error('User does not exist.');
		}

		return res.status(200).send({ success: true, data: user });
	} catch (error) {
		next({ status: 404, message: error.message });
	}
};

// METHOD    - PUT
// ENDPOINT  - /api/users/profile
// HEADERS   - { 'authorization': 'Bearer TOKEN' }
// BODY      - { username, displayName, email, password}
// PROTECTED - true
// TODO - New password should be a different endpoint
const updateUser = async (req, res, next) => {
	try {
		// User ID will be in the req if the user is authenticated
		const { id } = req.user;

		// Validate Password
		const isValid = await validatePassword(id, req.body.password);

		if (!isValid) {
			throw new Error('Validation failed, unable to update user');
		}

		// Update the user, passing in the req.body - which will contain the keys to update
		const user = await User.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		if (!user) {
			throw new Error('User does not exist');
		}

		return res.status(200).send({ success: true, data: user });
	} catch (error) {
		next({ status: 400, message: error.message });
	}
};

// METHOD    - DELETE
// ENDPOINT  - /api/users/profile
// HEADERS   - { 'authorization': 'Bearer TOKEN' }
// PROTECTED - true
const deleteUser = async (req, res, next) => {
	try {
		// User ID will be in the req if the user is authenticated
		const { id } = req.user;

		// Validate Password
		const isValid = await validatePassword(id, req.body.password);

		if (!isValid) {
			throw new Error('Validation failed, unable to delete user');
		}

		let user = await User.findByIdAndDelete(id);

		if (!user) {
			throw new Error('User does not exist.');
		}

		res.status(200).send({
			success: true,
			data: `${user.displayName}'s account has successfully been deleted.`,
		});
	} catch (error) {
		next({ status: 400, message: error.message });
	}
};

// METHOD    - GET
// ENDPOINT  - /api/users/:id/follow
// HEADERS   - { 'authorization': 'Bearer TOKEN' }
// PARAMS    - :id -> User ObjectID
// PROTECTED - true
const followUser = async (req, res, next) => {
	try {
		const followerID = req.user.id;
		const followingID = req.params.id;

		const follower = await User.findByIdAndUpdate(followerID, {
			$addToSet: { following: followingID },
		});

		const followee = await User.findByIdAndUpdate(followingID, {
			$addToSet: { followers: followerID },
		});

		if (!follower || !followee) {
			throw new Error('Something went wrong with the follow request');
		}

		res.status(200).send({
			success: true,
			data: `${followee.displayName} has been followed`,
		});
	} catch (error) {
		next({ status: 400, message: error.message });
	}
};

// METHOD    - GET
// ENDPOINT  - /api/users/:id/unfollow
// HEADERS   - { 'authorization': 'Bearer TOKEN' }
// PARAMS    - :id -> User ObjectID
// PROTECTED - true
const unfollowUser = async (req, res, next) => {
	try {
		const unfollowerID = req.user.id;
		const unfollowingID = req.params.id;

		const unfollower = await User.findByIdAndUpdate(unfollowerID, {
			$pull: { following: unfollowingID },
		});

		const unfollowee = await User.findByIdAndUpdate(unfollowingID, {
			$pull: { followers: unfollowerID },
		});

		if (!unfollower || !unfollowee) {
			throw new Error('Something went wrong with the unfollow request');
		}

		res.status(200).send({
			success: true,
			data: `${unfollowee.displayName} has been unfollowed`,
		});
	} catch (error) {
		next({ status: 400, message: error.message });
	}
};

module.exports = {
	createUser,
	getUsers,
	getUserById,
	getUserProfile,
	updateUser,
	deleteUser,
	loginUser,
	followUser,
	unfollowUser,
};
