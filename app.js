const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// app.use('/api/users', userRouter)

app.get('/healthcheck', (req, res) => {
	res.send('API IS RUNNING');
});

// TODO ! ADD Error Handler

module.exports = app;
