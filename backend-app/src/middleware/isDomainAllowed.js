let isDomainAllowed = async (req, res, next) => {
    let credentials = req?.body?.credentials || req.body.targetCredentials;
    let domain = credentials?.domain;
    let domainSuffix = credentials?.domainSuffix;
    let isAllowed = domainSuffix === '.uptycs.dev'
        || (['quality2', 'protectuexp', 'protectcs'].includes(domain) && domainSuffix === '.uptycs.io')
        || (['cxcamp', 'mdr'].includes(domain) && domainSuffix === '.uptycs.net');
    if (isAllowed) {
        return next();
    }
    console.log(`Not Allowed domain: ${domain} or domainSuffix: ${domainSuffix}`);
    if (req?.body?.credentials) return res.status(403).send({ 'message': `${domain}${domainSuffix} is not Allowed` });
    let details = { total: 1, failed: 1, errors: [{ "name": 'Target', "error": 'Domain Not allowed for migration' }] };
    return res.status(403).send({ details });
}

module.exports = isDomainAllowed;