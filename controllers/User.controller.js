const comparePassword = require('../helpers/compare-password');
const generateToken = require('../helpers/generate-jwt');
const hashPassword = require('../helpers/hash-password');
const User = require('../models/User.model');

const addUser = async (req, res, next) => {
	let status = 500;
	let message = 'Internal Server Error';

	try {
		if (
			!req.body.username ||
			!req.body.displayName ||
			!req.body.email ||
			!req.body.password
		) {
			status = 400;
			message = 'Missing required fields';
			throw new Error(message);
		}

		let newUser = req.body;

		newUser.password = await hashPassword(newUser.password);

		let savedUser = await User.create(newUser);
		res.status(201).send({ success: true, data: savedUser });
	} catch (error) {
		res.status(status).send({ success: false, data: error.message });
	}
};

const getUsers = async (req, res, next) => {
	try {
		let allUsers = await User.find();
		res.status(200).send({ success: true, data: allUsers });
	} catch (error) {
		res.status(400).send({ success: false, data: 'Something went wrong' });
	}
};

const getUserProfile = async (req, res, next) => {
	try {
		const { id } = req.user;
		let userToSend = await User.findById(id);
		if (userToSend != null) {
			res.status(200).send({ success: true, data: userToSend });
		} else {
			throw new Error('User does not exist.');
		}
	} catch (error) {
		next({ status: 404, message: error.message });
		// res.status(404).send({ success: false, data: 'User not found' });
	}
};

const updateUser = async (req, res, next) => {
	try {
		const { id } = req.user;
		const { username, password, email, displayName } = req.body;
		let user = await User.findById(id);
		let userToUpdate = await User.findByIdAndUpdate(
			id,
			{
				username: username == null ? user.id : username,
				password: password == null ? user.password : password,
				email: email == null ? user.email : email,
				displayname: displayName == null ? user.displayName : displayName,
			},
			{ returnOriginal: false }
		);
		if (userToUpdate != null) {
			res.status(200).send({ success: true, data: userToUpdate });
		} else {
			throw new Error('User does not exist.');
		}
	} catch (error) {
		next({status: 400, message: error.message})
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.user;
		let userToDelete = await User.findById(id);
		if (userToDelete != null) {
			await User.findByIdAndDelete(id);
			res.status(200).send({ success: true, data: userToDelete });
		} else {
			throw new Error('User does not exist.');
		}
	} catch (error) {
		next({status: 400, message: error.message})
	}
};

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

		const token = await generateToken(potentialUser.id);

		return res.send(token);
	} catch (error) {
		next({status: 400, message: error.message})
	}
};

module.exports = {
	addUser,
	getUsers,
	getUserProfile,
	updateUser,
	deleteUser,
	loginUser,
};
