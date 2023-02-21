const mongoose = require('mongoose');
const logger = require('../helpers/logger');

const connectDB = () => {
	return mongoose
		.connect(process.env.DB_URI)
		.then(() => {
			logger('Connected to MongoDB', 'INFO');
		})
		.catch((error) => logger(`Error: ${error.message}`, 'ERROR'));
};

module.exports = connectDB;
