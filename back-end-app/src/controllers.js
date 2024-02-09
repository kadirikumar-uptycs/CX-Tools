let { addRequestedUsersEmail, isUserExists } = require('./models');
let {getAllFlagProfiles} = require('./helperFunctions');

let storeUserRequest = async (req, res) => {
    let email = req.body.email;
    let done = await addRequestedUsersEmail(email);
    if (done) {
        res.status(200).send({ "message": "Request sent to Admin." });
    }
    else {
        res.status(200).send({ "message": "Requesting access cannot be done at this moment." });
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


const getFlagProfiles = async (req, res) => {


    let credentials = req.body.credentials;

    let {status, data} = await getAllFlagProfiles(credentials);

    res.status(status).send(data);
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
    getFlagProfiles,
    logout,
}