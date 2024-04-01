let helpers = require('../../Helpers');



async function eventRule(sourceCredentials, targetCredentials, endpoint, payload) {
    let id = payload.id;
    let eventRuleEndpoint = `${endpoint}/${id}`;
    let { status, data: fullData } = await helpers.getResources(sourceCredentials, eventRuleEndpoint, true);

    if (status === 200) {
        let response = await migrateExceptions(fullData?.exceptions || [], sourceCredentials, targetCredentials);
        return response;
    } else {
        return { status, data: "Error while retrieving full data of event rule " + data?.message?.detail };
    }
}



async function migrateExceptions(sourceExceptions, sourceCredentials, targetCredentials) {
    let targetExceptions = [];
    try {
        let { status, data: targetExceptionsList } = await helpers.getResources(targetCredentials, 'exceptions');
        if (status !== 200) targetExceptionsList = [];

        for (let exception of sourceExceptions) {
            let exceptionId = exception?.exceptionId;
            let exceptionURL = `exceptions/${exceptionId}`


            // GET Exception details
            let { status, data: exceptionDetails } = await helpers.getResources(sourceCredentials, exceptionURL, true)
            if (status === 200) {
                // find if any exception in target with same name
                let findexception = targetExceptionsList.find(obj => obj.name === exceptionDetails.name)
                // check if exception rules is also same
                if (!isSameObjects(findexception?.rule, exceptionDetails?.rule)) {
                    if (findexception) exceptionDetails.name = payload.name + '__' + exceptionDetails.name;
                    findexception = undefined;
                }
                if (findexception) {
                    targetExceptions.push({ 'exceptionId': findexception.id, 'isCreated': false });
                } else {
                    try {
                        let { status, data: postResponse } = await helpers.postResources(targetCredentials, exceptionDetails, 'exceptions');

                        if (status !== 200) {
                            await deleteExceptions(targetCredentials, targetExceptions.filter(exception => exception.isCreated));
                            return { status, "data": `Error while posting exception : ${exceptionDetails?.name}, Error : ${postResponse?.message?.detail}` };
                        } else {
                            targetExceptions.push({ 'exceptionId': postResponse.id, 'isCreated': true });
                        }
                    } catch (error) {
                        console.log(error);
                        return { status: 500, "data": `Bad code handling while posting exception ${exceptionDetails.name}, Error : ${error}` };
                    }
                }
            } else {
                return { status, "data": `Error while retrieving exception ${exceptionId}, Error : ${exceptionDetails?.message?.detail}` };
            }
        }

    } catch (error) {
        console.log(error);
        return { status: 500, data: "Bad code handling while retrieving and posting exceptions of eventrules " + error };
    }
    return { status: 200, data: targetExceptions };
}



async function deleteExceptions(credentials, exceptions) {
    for (const exception of exceptions) {
        try {
            await helpers.deleteResource(credentials, `exceptions/${exception.exceptionId}`);
        } catch (error) {
            return { status: 500, data: `Bad code handling while deleting exception ${exception.name} ` + error };
        }
    }
    return { status: 200, data: 'Done!!!' }
}

function isSameObjects(obj1, obj2) {
    return obj1 && obj2 && JSON.stringify(obj1) === JSON.stringify(obj2);
}

module.exports = {
    eventRule,
    migrateExceptions,
    deleteExceptions,
};