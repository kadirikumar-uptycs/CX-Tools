let helpers = require('../../Helpers');


async function customdashboard(sourceCredentials, targetCredentials, resource, endpoint, targetdashboardId) {
    let id = resource.id;
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
                    return { status, "data": `Error while posting section ${section.name}, Error : ${postResponse?.message?.detail}` };
                }
            } catch (error) {
                return { status: 500, "data": `Error while posting section ${section.name}, Error : ${error}` };
            }
        }
    } else {
        return { status, "data": fullData.message.detail };
    }

    return {status: 200, "data": "Done!!!"}
}

module.exports = customdashboard;