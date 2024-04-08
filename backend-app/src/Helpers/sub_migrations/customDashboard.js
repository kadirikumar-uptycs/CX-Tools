let helpers = require('../../Helpers');


async function customdashboard(sourceCredentials, targetCredentials, resource, endpoint, targetdashboardId) {
    let id = resource.id;
    let resStatus = 200;
    let errors = [];
    let resourceEndpoint = `${endpoint}/${id}`;
    let { status, data: fullData } = await helpers.getResources(sourceCredentials, resourceEndpoint, true);

    if (status === 200) {
        let sectionsInfo = fullData.sections;
        let sectionsEndpoint = `${endpoint}/${targetdashboardId}/sections`;

        // POST sections
        for (const section of sectionsInfo) {
            try {
                let formattedSection = helpers.payloadFormatter.reportSection(section);
                let { status, data:postResponse } = await helpers.postResources(targetCredentials, formattedSection, sectionsEndpoint);
                if (status !== 200) {
                    resStatus = status;
                    errors.push(`Error while posting section: "${section.title}", Error : ${postResponse?.message?.detail}`);
                }
            } catch (error) {
                errors.push(`Error while posting section: "${section.title}", Error : ${error}`);
                resStatus = 500;
            }
        }
    } else {
        errors.push(`Error retrieving corresponding sections data, ${fullData?.message?.detail}`);
        resStatus = status;
    }

    return {status: resStatus, errors};
}

module.exports = customdashboard;