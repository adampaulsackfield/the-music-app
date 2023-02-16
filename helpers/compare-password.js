const bcrypt = require('bcrypt');

const comparePassword = async (candidatePassword, encryptedPassword) => {
	return bcrypt.compare(candidatePassword, encryptedPassword);
};

module.exports = comparePassword;
