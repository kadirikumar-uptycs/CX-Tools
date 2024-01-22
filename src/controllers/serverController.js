// controllers for server api requests
const mongodb = require('../modals/mongoDB');
const {getAllFlagProfiles, postFlagProfiles} = require('./flagProfiles');

const storeUserRequests = async(req, res) => {
    data = req.body;
    userEmail = data.email;
    let done = await mongodb.addRequestedUsersEmail(userEmail)
    if(done){
        res.status(200).send({"message" : "Request sent to Admin."});
    }
    else{
        res.status(200).send({"message" : "Requesting access cannot be done now."});
    }
}

const successfullLogin = (_, res) => {
    return res.status(200).send({'message' : "Auth Done!!!"});
}



const getFlagProfiles = async (req, res) => {

    requiredKeys = ["id", "customerId", "key", "secret", "domain", "domainSuffix"];
    let credentials = req.body;

    let isValidFile = requiredKeys.every(key => key in credentials);
    if(!isValidFile){
        return res.status(422).send({"message" : {'detail' : 'Lacking Credentials Info. Make sure all the required keys are present inside the file.'}})
    }

    let {status, data} = await getAllFlagProfiles(credentials);

    res.status(status).send(data);
}


const migrateFlagProfiles = async (req, res) => {
    let flagProfiles = req.body.flagProfiles;
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

    res.status(resStatus).send({"errorDetails" : errorDetails});
}



module.exports = {
    successfullLogin,
    storeUserRequests,
    getFlagProfiles,
    migrateFlagProfiles,
};