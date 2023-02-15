const chalk = require('chalk');

// Custom logger using Chalk to color the output
const logger = (message, level = 'ERROR') => {
	if (level === 'INFO') return console.log(chalk.blueBright(message));
	if (level === 'WARN') return console.log(chalk.yellowBright(message));

	return console.log(chalk.redBright(message));
};

module.exports = logger;
