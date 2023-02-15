const { PORT = 5550 } = process.env;
const app = require('./app');
const logger = require('./helpers/logger');

app.listen(PORT, () => logger(`Server is running on PORT:${PORT}`, 'INFO'));
