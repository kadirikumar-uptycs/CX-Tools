let getHeaders = require('../Helpers/APIheaders');

const getAuthToken = (req, res) => {
    try {
        let { Authorization } = getHeaders(req?.body);
        return res.status(200).send(Authorization);
    } catch (error) {
        return res.status(500).send('Invalid Credentials');
    }
}


module.exports = getAuthToken;