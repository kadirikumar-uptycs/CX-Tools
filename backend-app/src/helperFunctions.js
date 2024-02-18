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


let getResources = async (credentials, endpoint) => {

	let domain = credentials["domain"] + credentials["domainSuffix"];
	let { customerId } = credentials;
	let creds = getHeaders(credentials);

	const url = `https://${domain}/public/api/customers/${customerId}/${endpoint}`;

	try {
		const response = await axios.get(url, { headers: creds });

		if (response.status === 200) {
			let allResources = response.data.items;
			let customResources = (endpoint === 'exceptions')?allResources:allResources.filter(resource => resource.custom);
			return { status: response.status, data: customResources };
		} else {
			return { status: response.status, data: response.data };
		}
	} catch (error) {
		if (error.response) {
			return { status: error.response.status, data: error.response.data.error };
		} else {
			return { status: 500, data: { "message": { 'detail': 'Request setup error' } } };
		}
	}

}



let postResources = async (credentials, payload, endpoint) => {

	let domain = credentials["domain"] + credentials["domainSuffix"];
	let { customerId } = credentials;
	let creds = getHeaders(credentials);

	const url = `https://${domain}/public/api/customers/${customerId}/${endpoint}`;

	try{
		const response = await axios.post(url, payload, { headers: creds });

		if(response.status === 200) {
			return { status: response.status, data: 'Success' };
		}
	} catch (error) {
		if (error.response) {
			return { status: error.response.status, data: error.response.data.error };
		} else {
			return { status: 500, data: { "message": { 'detail': 'Request setup error' } } };
		}
	}
}


module.exports = {
	getResources,
	postResources,
}