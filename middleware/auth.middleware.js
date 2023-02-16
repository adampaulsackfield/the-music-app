const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const protectedRoute = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.user = await User.findById(decoded.id);

			next();
		} catch (err) {
			next({ status: 401, message: 'Not authorized' });
		}
	}
	if (!token) {
		next({ status: 401, message: 'Not authorized. No token' });
	}
};

module.exports = protectedRoute;
