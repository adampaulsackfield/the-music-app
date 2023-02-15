// Environment Variables
require('dotenv').config();

// Imports
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error.middleware');
const connectDB = require('./database/connection');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Database
connectDB();

// Routing
// app.use('/api/users', userRouter)

app.get('/healthcheck', (request, response) => {
	response.send('API IS RUNNING');
});

// Error Handler
// app.use(errorHandler);

module.exports = app;
