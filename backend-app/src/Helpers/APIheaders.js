let jwt = require('jsonwebtoken');
let moment = require('moment');

function getHeaders(credentials) {
	try {
		let expiry = moment().add(5, 'minutes');
		let expiryFormatted = expiry.format('YYYY-MM-DD HH:mm');

		let { key, secret } = credentials;

		// Encode JWT token
		let token = jwt.sign({ iss: key, exp: expiry.unix() }, secret);
		let auth = `Bearer ${token}`;
		let creds = {
			"Expiration": expiryFormatted,
			"Authorization": auth,
		};
		return creds;

	} catch (error) {
		console.log(error);
		return null;
	}
}

module.exports = getHeaders;