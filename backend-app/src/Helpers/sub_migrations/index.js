let eventRuleImports = require('./eventRule');
let customdashboard = require('./customDashboard');
let fileGroupPathImports = require('./filePathGroup');



module.exports = {
    ...eventRuleImports,
    ...fileGroupPathImports,
    customdashboard,
}