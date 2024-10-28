let axios = require('axios');
let getHeaders = require('./APIheaders');

let getResources = async (credentials, endpoint, isSingle = false) => {

	let domain = credentials?.domain + credentials?.domainSuffix;
	let { customerId } = credentials;
	let creds = getHeaders(credentials);

	const url = `https://${domain}/public/api/customers/${customerId}/${endpoint}`;
	let fullData = [];

	try {
		let offset = 0;
		while (true) {
			currentURL = `${url}?offset=${offset}`;
			console.log(`${domain}: Calling API : ${currentURL}\n`);
			const response = await axios.get(currentURL, { headers: creds });
			console.log(`↓↳ ${domain} : Status : ${response.status}\n`);
			try {
				if (response.status === 200) {
					if (isSingle) {
						return { status: response.status, data: response.data };
					}
					let allResources = response.data.items;
					let done = allResources.length < 1000;
					// filter the custom resources
					allResources = (['exceptions', 'customProfiles'].includes(endpoint)) ? allResources : allResources.filter(resource => resource.custom);
					
					fullData = [...fullData, ...allResources];
					if(done){
						console.log(`↓↳ ${domain}:  Done!!! ✅\n`);
						return { status: response.status, data: fullData };
					}
					console.log(`↓↳ ${domain}: Not Done ⏳\n`);
				} else {
					return { status: response.status, data: fullData };
				}
			} catch (error) {
				console.log('Error occurred while preprocessing the response, Poor Error Handling 😒\n');
				return { status: 500, data: { "message": { 'detail': 'error from CX-Tools server' } } };
			}
			offset += 1000;
		}
	} catch (error) {
		console.log(`🛑↓↳ ${domain}: ${error}\n`);
		if (error.response) {
			return { status: error.response.status, data: error.response.data.error };
		} else {
			return { status: 500, data: { "message": { 'detail': 'Request setup error' } } };
		}
	}
}

module.exports = getResources;