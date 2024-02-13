let { addRequestedUsersEmail, isUserExists } = require('./models');
let {postFlagProfiles, getResources} = require('./helperFunctions');

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
    let userInfo = req.body;
    let isExists = await isUserExists({'email' : userInfo.email});
    if(!isExists){
        return res.status(401).send({'message' : "User Not Exist, please create an account"})
    }
    req.session.user = userInfo;
    return res.status(200).send({"message" : "Auth Done!!!"})

}

let Authenticated = async (_, res) => {
    return res.status(200).send({'Authorized' : true});
}


let userInfo = (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).send(req.session.user);
    }
    return res.status(404).send({})
}


const getTenantResources = async (req, res, endpoint) => {

    let credentials = req.body.credentials;

    let {status, data} = await getResources(credentials, endpoint);

    return res.status(status).send(data);
}



const migrateFlagProfiles = async (req, res) => {
    let flagProfiles = req.body.resources;
    let credentials = req.body.credentials;

    let errorDetails = [];
    let resStatus = 200;

    for (const profile of flagProfiles) {
            const { status, data } = await postFlagProfiles(credentials, profile);

            if (status !== 200) {
                errorDetails.push({ "name": profile.name, "error": data.message.detail });
                resStatus = status;
            }
    }

    return res.status(resStatus).send({"errorDetails" : errorDetails});
}



let logout = (req, res) => {
    if (req.session){
        req.session.destroy();
    }
    return res.status(200).send({'message' : 'LoggedOut'})
}

module.exports = {
    storeUserRequest,
    validateLoginUser,
    Authenticated,
    userInfo,
    getTenantResources,
    migrateFlagProfiles,
    logout,
}