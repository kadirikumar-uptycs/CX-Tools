let axios = require('axios');

let postTotangoCollection = async (data) => {
	let url = 'https://int-hub.totango.com/api/v1/collections/ticketsData';
	let headers = { service_id: 278409, Authorization: 'app-token {v2}09b740e6-67e0-410d-900e-704f60fbe5bd' };
	let zohoTotangoMap = {
		"id": "st_id",
		"ticketNumber": "st_number",
		"status": "st_status",
		"priority": "st_priority",
		"createdTime": "st_createdAt"
	}
	let payload = {
		"collections": data.map(ticket => {

			let requiredAttributes = (ticket) => {
				let temp = {};
				for([key, value] of Object.entries(zohoTotangoMap)){
					temp[value] = ticket[key];
				}
				return temp;
			};
			return {
				"id": ticket.id,
				"account_id": "test",
				"attributes": requiredAttributes(ticket),
			}
		})
	};
	console.log(JSON.stringify(payload));

	try{
		let response = await axios.post(url, payload, {headers});
		console.log(response.status);
		return { data: response.data, status: response.status };
	}catch(error){
		return {data: error.response.data, status: error.response.status};
	}
}

module.exports = postTotangoCollection;