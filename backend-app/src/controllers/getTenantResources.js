let helpers = require('../Helpers')

const getTenantResources = async (req, res) => {

	let endpoint = req.params.endpoint;

	let credentials = req.body.credentials;

	let { status, data } = await helpers.getResources(credentials, endpoint);

	return res.status(status).send(data);
}

module.exports = getTenantResources;