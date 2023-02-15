// Environment Variables
require('dotenv').config();

// Imports
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./database/connection');

const errorHandler = require('./middleware/error-handler.middleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Database
connectDB();

// Routing
// app.use('/api/users', userRouter);

app.get('/healthcheck', (req, res) => {
	res.send('API IS RUNNING');
});

app.use(errorHandler);

module.exports = app;
