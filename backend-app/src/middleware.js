let { isUserExists } = require('./models');

let isAuthenticated = async (req, res, next) => {
    var origin = req?.get('origin');
    var userIP = req?.socket?.remoteAddress;

    console.log(`Validating request from origin: ${origin}, IP: ${userIP}`);

    if (req.session && req.session.user) {
        let userInfo = { 'email': req.session.user.email };
        let isExists = await isUserExists(userInfo);
        console.log("Valid User...");
        if (isExists) {
            return next();
        }
    }
    console.log("Invalid User");
    return res.status(401).send({ 'Authorized': false });
}



let isDomainAllowed = async (req, res, next) => {
    let credentials = req?.body?.credentials || req.body.targetCredentials;
    let domain = credentials?.domain;
    let domainSuffix = credentials?.domainSuffix;
    let isAllowed = domainSuffix === '.uptycs.dev'
        || (['quality2', 'protectuexp'].includes(domain) && domainSuffix === '.uptycs.io')
        || (['cxcamp', 'mdr'].includes(domain) && domainSuffix === '.uptycs.net');
    if (isAllowed) {
        return next();
    }
    console.log(`Not Allowed domain: ${domain} or domainSuffix: ${domainSuffix}`);
    if(req?.body?.credentials) return res.status(403).send({ 'message': 'Domain Not Allowed' });
    return { total: 1, failed: 1, errors: [{ "name": domain+domainSuffix, "error": 'Domain Not allowed for migration' }] };
}

module.exports = {
    isAuthenticated,
    isDomainAllowed,
}