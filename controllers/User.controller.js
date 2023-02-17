const comparePassword = require('../helpers/compare-password');
const generateToken = require('../helpers/generate-jwt');
const hashPassword = require('../helpers/hash-password');
const User = require('../models/User.model');

// METHOD    - POST
// ENDPOINT  - /api/users
// BODY      - { username, displayName, email, password }
// PROTECTED - false
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

		let newUser = req.body;

		newUser.password = await hashPassword(newUser.password);

		let savedUser = await User.create(newUser);

		res.status(201).send({ success: true, data: savedUser });
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

		const potentialUser = await User.findOne({ email }).select('+password');

		if (!potentialUser) {
			throw new Error('Invalid login credentials');
		}

		const isValid = await comparePassword(password, potentialUser.password);

		if (!isValid) {
			throw new Error('Invalid login credentials');
		}

		const token = await generateToken(potentialUser.id); // TODO - Possibly check for token creation failure and send back message

		return res.status(200).send({ success: true, data: token });
	} catch (error) {
		next({ status: 401, message: error.message });
	}
};

// METHOD    - GET
// ENDPOINT  - /api/users
// PROTECTED - false
// TODO Should this be protected
const getUsers = async (req, res, next) => {
	try {
		let allUsers = await User.find();
		res.status(200).send({ success: true, data: allUsers });
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
		const { id } = req.user;
		const userToSend = await User.findById(id)
		.populate('followers', 'displayName').populate('following', 'displayName');
		

		if (!userToSend) {
			throw new Error('User does not exist.');
		}

		res.status(200).send({ success: true, data: userToSend });
	} catch (error) {
		next({ status: 404, message: error.message });
	}
};

// METHOD    - PUT
// ENDPOINT  - /api/users/profile
// HEADERS   - { 'authorization': 'Bearer TOKEN' }
// BODY      - { username, displayName, email, password}
// PROTECTED - true
const updateUser = async (req, res, next) => {
	try {
		const { id } = req.user;
		const { username, password, email, displayName } = req.body;

		const user = await User.findById(id);

		// TODO - Confirm password when updating, using compare function
		const updatedUser = {
			username: username == null ? user.username : username,
			email: email == null ? user.email : email,
			displayname: displayName == null ? user.displayName : displayName,
			password: password == null ? user.password : password,
		};

		const userToUpdate = await User.findByIdAndUpdate(id, updatedUser, {
			returnOriginal: false,
		});

		if (!userToUpdate) {
			throw new Error('User does not exist.');
		}

		res.status(200).send({ success: true, data: userToUpdate });
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
		const { id } = req.user;

		let userToDelete = await User.findByIdAndDelete(id);

		if (!userToDelete) {
			throw new Error('User does not exist.');
		}

		res.status(200).send({ success: true, data: userToDelete });
	} catch (error) {
		next({ status: 400, message: error.message });
	}
};

const followUser = async(req, res, next) =>{
	try{
		const followerID = req.user.id;
		const followingID = req.params.id;
		
		const follower = await User.findByIdAndUpdate(followerID, {$addToSet: {following: followingID}});
		const followee = await User.findByIdAndUpdate(followingID, {$addToSet:{followers: followerID}});
		res.status(200).send({success: true, data: {follower, followee}});

	} catch (error){
		next({status: 400, message: error.message});
	}
}

const unfollowUser = async(req, res, next) =>{
	try{
		const unfollowerID = req.user.id;
		const unfollowingID = req.params.id;
		
		const unfollower = await User.findByIdAndUpdate(unfollowerID, {$pull:{following: unfollowingID}});
		const unfollowee = await User.findByIdAndUpdate(unfollowingID, {$pull:{followers: unfollowerID}});
		res.status(200).send({success: true, data: `${unfollowee.displayName} has been unfollowed`});
	} catch (error){
		next({status: 400, message: error.message});
	}
}

module.exports = {
	createUser,
	getUsers,
	getUserProfile,
	updateUser,
	deleteUser,
	loginUser,
	followUser,
	unfollowUser
};
