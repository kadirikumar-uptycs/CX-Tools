let axios = require('axios');
let jwt = require('jsonwebtoken');
let moment = require('moment');


let getHeaders = (credentials) => {
	let expiry = moment().add(1, 'hour');
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
}


let getAllFlagProfiles = async (credentials) => {

	let domain = credentials["domain"] + credentials["domainSuffix"];
	let { customerId } = credentials;
	let creds = getHeaders(credentials);

	const url = `https://${domain}/public/api/customers/${customerId}/flagProfiles`;

	try {
		const response = await axios.get(url, { headers: creds });

		if (response.status === 200) {
			let allProfiles = response.data.items;
			let customProfiles = allProfiles.filter(profile => profile.custom)
			return { status: response.status, data: customProfiles };
		} else {
			return { status: response.status, data: response.data };
		}
	} catch (error) {
		if (error.response) {
			return { status: error.response.status, data: error.response.data.error};
		} else {
			return { status: 500, data: { "message": { 'detail': 'Request setup error' } } };
		}
	}

}



let postFlagProfiles = async (credentials, payload) => {
	let domain = credentials["domain"] + credentials["domainSuffix"];
	let { customerId } = credentials;
	let creds = getHeaders(credentials);

	const url = `https://${domain}/public/api/customers/${customerId}/flagProfiles`;

	try{
		const response = await axios.post(url, payload, { headers: creds });

		if(response.status === 200) {
			return { status: response.status, data: 'Success' };
		}
	}catch(error){
		if (error.response.status) {
			return { status: error.response.status, data: error.response.data.error };
		} else {
			return { status: 500, data: { "message": { 'detail': 'Request setup error' } } };
		}
	}
}




module.exports = { 
	getAllFlagProfiles,
	postFlagProfiles,
 }