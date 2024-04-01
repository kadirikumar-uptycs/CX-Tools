let axios = require('axios');
let getHeaders = require('./APIheaders');

let deleteResource = async (credentials, endpoint) => {

    let domain = credentials["domain"] + credentials["domainSuffix"];
    let { customerId } = credentials;
    let creds = getHeaders(credentials);

    const url = `https://${domain}/public/api/customers/${customerId}/${endpoint}`;

    try {
        console.log(`${domain}: DELETE Request Sent : ${url}\n`);
        const response = await axios.delete(url, { headers: creds });
        console.log(`↓↳ Delete Request to ${domain} => Status : ${response.status}\n`);
        if (response.status === 200) {
            console.log(`↓↳ Delete Request to ${domain} => Done!!! ✅\n`);
            return { status: response.status, data: response.data };
        }
    } catch (error) {
        console.log(`🛑↓↳ Delete Request to ${domain}: ${error}\n`);
        console.log(error?.response?.data);
        if (error.response) {
            return { status: error.response.status, data: error.response.data.error };
        } else {
            return { status: 500, data: { "message": { 'detail': 'Request setup error' } } };
        }
    }
}

module.exports = deleteResource;