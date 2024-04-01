let getHeaders = require('./APIheaders');
let getResources = require('./getUptycsData');
let postResources = require('./postToUptycs');
let zohoTickets = require('./getZohoTickets');
let postTotangoCollection = require('./postToTotango');
let payloadFormatter = require('./payloadFormatter');
let deleteResource = require('./deleteFromUptycs');

module.exports = {
    getHeaders,
    getResources,
    postResources,
    zohoTickets,
    postTotangoCollection,
    payloadFormatter,
    deleteResource,
}