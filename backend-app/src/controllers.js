let { addRequestedUsersEmail, isUserExists, getUsers, addNewUser, updateUserInfo } = require('./models');
let helpers = require('./Helpers');
let sub_migrations = require('./Helpers/sub_migrations')

let storeUserRequest = async (req, res) => {
	let email = req.body.email;
	let done = await addRequestedUsersEmail(email);
	if (done) {
		return res.status(200).send({ "message": "Request sent to Admin." });
	}
	else {
		return res.status(200).send({ "message": "Requesting access cannot be done at this moment." });
	}
}

let validateLoginUser = async (req, res) => {
	var origin = req?.get('origin');
	var userIP = req?.socket?.remoteAddress;

	console.log(`Validating request origin: ${origin}, IP: ${userIP}`);
	let userInfo = req.body;
	let isExists = await isUserExists({ 'email': userInfo.email });
	if (!isExists) {
		return res.status(401).send({ 'message': "User Not Exist, please create an account" })
	}

	// store user data in the session
	req.session.user = userInfo;

	updateUserInfo(userInfo);
	return res.status(200).send({ "message": "Auth Done!!!" })
}


let userInfo = (req, res) => {
	if (req.session && req.session.user) {
		return res.status(200).send(req.session.user);
	}
	return res.status(404).send({})
}


const getTenantResources = async (req, res) => {

	let endpoint = req.params.endpoint;

	let credentials = req.body.credentials;

	let { status, data } = await helpers.getResources(credentials, endpoint);

	return res.status(status).send(data);
}


const migrateTenantResources = async (req, res) => {


	let endpoint = req.params.endpoint;
	let resources = req.body.resources;
	let sourceCredentials = req.body.sourceCredentials;
	let targetCredentials = req.body.targetCredentials;

	let errorDetails = [];
	let subMigrationsData = [];
	let resStatus = 200;
	let total = resources.length;

	for (const resource of resources) {

		if (resource.type === 'javascript') {
			errorDetails.push({ "name": resource.name, "error": "Event Rule of type Javascript is deprecated." })
			resStatus = 400;
			continue;
		}

		let payload = JSON.parse(JSON.stringify(resource));
		let isOk = true;
		if (endpoint === 'eventRules') payload = helpers.payloadFormatter.eventRule(payload);
		if (endpoint === 'alertRules') payload = helpers.payloadFormatter.alertRule(payload);
		if (endpoint === 'filePathGroups') payload = helpers.payloadFormatter.filePathGroup(payload);
		if (endpoint === 'eventExcludeProfiles') payload = helpers.payloadFormatter.eventExcludeProfile(payload);
		if (endpoint === 'customdashboards') payload = helpers.payloadFormatter.customdashboard(payload);
		if (endpoint === 'yaraGroupRules') payload = helpers.payloadFormatter.yaraRule(payload);
		if (endpoint === 'roles') payload = helpers.payloadFormatter.role(payload);


		// S U B   M I G R A T I O N S

		if (endpoint === 'eventRules' && resource?.type === 'builder') {
			let { status, data } = await sub_migrations.eventRule(sourceCredentials, targetCredentials, endpoint, resource);
			subMigrationsData = data;
			console.log("S U B   M I G R A T I O N S : ", status);

			isOk = status === 200;
			if (status === 200) {
				payload.builderConfig.autoAlertConfig.exceptions = subMigrationsData.map(obj => ({ 'exceptionId': obj.exceptionId }));
			} else {
				resStatus = status;
			}
		}
		// S U B   M I G R A T I O N S

		if (endpoint === 'alertRules') {
			let { status, data } = await sub_migrations.migrateExceptions(payload?.alertRuleExceptions || [], sourceCredentials, targetCredentials);
			subMigrationsData = data;
			console.log("S U B   M I G R A T I O N S : ", status);

			isOk = status === 200;
			if (status === 200) {
				payload.alertRuleExceptions = subMigrationsData.map(obj => ({ 'exceptionId': obj.exceptionId }));
			} else {
				resStatus = status;
			}
		}


		// S U B   M I G R A T I O N S
		if (endpoint === 'filePathGroups') {
			let { status, data } = await sub_migrations.filePathGroup(targetCredentials, payload);
			subMigrationsData = data;
			console.log("S U B   M I G R A T I O N S : ", status);

			isOk = status === 200;
			if (status === 200) {
				payload.signatures = subMigrationsData?.signatureDetails.map(obj => ({ 'id': obj.id }));
				payload.yaraGroupRules = subMigrationsData?.yaraRuleDetails.map(obj => ({ 'id': obj.id }));
			} else {
				resStatus = status;
				errorDetails.push({ "name": resource.name, "error": subMigrationsData });
			}
		}

		if (isOk) {
			console.log(payload);
			const { status, data: postResponse } = await helpers.postResources(targetCredentials, payload, endpoint);
			if (status !== 200) {
				resStatus = status;
				errorDetails.push({ "name": resource.name, "error": postResponse.message.detail });
				if (['eventRules', 'alertRules'].includes(endpoint)) await sub_migrations.deleteExceptions(targetCredentials, subMigrationsData.filter(obj => obj.isCreated));
				if (endpoint === 'filePathGroups') {
					await sub_migrations.deleteSignatures(targetCredentials, subMigrationsData?.signatureDetails.filter(obj => obj.isCreated));
					await sub_migrations.deleteYaraRules(targetCredentials, subMigrationsData?.yaraRuleDetails.filter(obj => obj.isCreated));
				}
			} else {
				if (endpoint === 'customdashboards') {
					let { status, errors: sectionResponse } = await sub_migrations.customdashboard(sourceCredentials, targetCredentials, resource, endpoint, postResponse.id);

					if (status !== 200) {
						errorDetails.push({ "name": resource.name, "error": sectionResponse });
						resStatus = status;
					}
				}
			}
		}
	}

	let details = { total, failed: errorDetails.length, errors: errorDetails };

	return res.status(resStatus).send({ details });
}


let getUsersDetails = async (req, res) => {
	let users = await getUsers();
	return res.status(users ? 200 : 500).send(users);
}

let addUser = async (req, res) => {
	let document = req.body;
	let { status, data } = await addNewUser(document);
	return res.status(status).send(data);
}


let getZohoTickets = async (req, res) => {
	let limit = req.query.limit;
	let { data, status } = await helpers.zohoTickets(limit);
	return res.status(status).send(data);
}

let zohoToTotango = async (req, res) => {
	let limit = req.query.limit;

	let { data, status } = await helpers.zohoTickets(limit);
	console.log(`Zoho : ${status}`);
	if (status === 200) {
		let response = await postTotangoCollection(data?.data);
		console.log(response.status);
		res.status(200).send(response);
	} else {
		res.status(200).send(data);
	}
}



let logout = (req, res) => {
	if (req.session) {
		req.session.destroy();
	}
	return res.status(200).send({ 'message': 'LoggedOut' })
}

module.exports = {
	storeUserRequest,
	validateLoginUser,
	userInfo,
	getTenantResources,
	migrateTenantResources,
	getUsersDetails,
	addUser,
	getZohoTickets,
	zohoToTotango,
	logout,
}