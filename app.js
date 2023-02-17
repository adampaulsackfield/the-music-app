// Environment Variables
require('dotenv').config();
const userRouter = require('./routes/User.routes');

// Imports
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./database/connection');
const followRouter = require('./routes/Follow.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Database
if (process.env.NODE_ENV !== 'test') {
	connectDB();
}

// Routing User
app.use('/api/users', userRouter);

// Routing Follow
app.use('/api/follow', followRouter);

app.get('/healthcheck', (req, res) => {
	res.send('API IS RUNNING');
});

// Error Handler
app.use((err, req, res, next) => {
	if (err.status && err.message) {
		res.status(err.status).send({ success: false, data: err.message });
	} else {
		next(err);
	}
});

module.exports = app;
