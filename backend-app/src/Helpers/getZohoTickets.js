let axios = require('axios');

let zohoTickets = async (limit) => {

	let URL = `https://desk.zoho.com/api/v1/tickets?include=contacts,products,assignee,departments,team&status=Engineering Review,Uptycs Investigating,Pending Closure,Waiting on Customer,Open&limit=${limit}`;
	let access_token = "1000.6fc3e60df2a6590afeddd8e745f6d52d.c4feefd3ba05bebb5c5bad54b306f891";
	let headers = {
		orgId: '734382979',
		Authorization: `Zoho-oauthtoken ${access_token}`
	}

	try {
		let response = await axios.get(URL, { headers });
		let data = response.data;
		return { data, status: response.status };
	} catch (error) {
		return { data: error.response.data, status: error.response.status };
	}
}

module.exports = zohoTickets;