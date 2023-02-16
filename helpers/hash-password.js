const bcrypt = require('bcrypt');

const hashPassword = async (candidatePassword) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(candidatePassword, salt);

		return hash;
	} catch (err) {
		console.log('err', err); // TODO - Handle Error
		throw err;
	}
};

module.exports = hashPassword;
