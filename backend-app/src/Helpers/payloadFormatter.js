// Function to delete nested properties in an object
const deleteNestedProperty = (obj, keysArray) => {
    keysArray.forEach(key => {
        let currentObj = obj;
        const keys = key.split('.');
        for (let i = 0; i < keys.length - 1; i++) {
            if (typeof currentObj !== 'object') {
                return;
            }
            currentObj = currentObj[keys[i]];
        }
        delete currentObj[keys[keys.length - 1]];
    });
    return obj;
};

function eventRule(payload) {
    const keysToDelete = [
        'sqlConfig.lastRanAt',
        'id',
        'customerId',
        'seedId',
        'uptycsScore',
        'potentialImpact',
        'remediationSteps',
        'createdAt',
        'links',
        'isInternal',
        'throttled',
        'sigmaRule',
        'createdBy',
        'updatedAt',
        'updatedBy',
        'transformations',
        'alertTimeSuppresionStart',
        'alertTimeSuppresionDuration'
    ];

    let builderKeysToBeDeleted = [
        'builderConfig.id',
        'builderConfig.customerId',
    ]

    let eventType = payload.type;
    payload.sqlConfig ??= {};
    payload.scriptConfig ??= {};
    payload.builderConfig ??= {};
    payload.sqlConfig.intervalSeconds ??= 3600;
    // payload.tags = payload.tags.map(({id}) => ({id}));
    payload.tags = [];

    payload.builderConfig.transformations = payload.transformations;

    keysToBeDeleted = [...keysToDelete];

    if (eventType === 'builder') {
        payload.scriptConfig.tableName = payload.builderConfig.tableName;
        payload.scriptConfig.added = payload.builderConfig.added;
        (payload.builderConfig.autoAlertConfig) && (payload.builderConfig.autoAlertConfig.disableAlert = false);
        keysToBeDeleted = [...keysToBeDeleted, ...builderKeysToBeDeleted];
    }

    payload = deleteNestedProperty(payload, keysToBeDeleted);
    if (!payload.description) delete payload.description;
    return payload;
}



function alertRule(payload) {
    const keysToDelete = [
        "id",
        "customerId",
        "seedId",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
        "isInternal",
        "lock",
        "alertNotifyInterval",
        "alertNotifyCount",
        "alertConfig",
        "potentialImpact",
        "remediationSteps",
        "timeSuppressionStart",
        "timeSuppressionDuration",
        "alertTags",
        "alertRuleExceptions.customerId",
        "alertRuleExceptions.createdAt",
        "alertRuleExceptions.updatedAt",
        "alertRuleQueries.customerId",
        "alertRuleQueries.sequence",
        'sqlConfig.lastRanAt',
        "links",
    ];

    payload.sqlConfig ??= {};
    payload.scriptConfig ??= {};
    payload.builderConfig ??= {};
    payload.sqlConfig.intervalSeconds ??= 3600;

    payload.scriptConfig.eventCode = payload.code;
    payload.scriptConfig.eventMinSeverity ??= 'low';
    payload.builderConfig.eventCode = payload.code;
    payload.builderConfig.eventMinSeverity ??= 'low';

    // Remove Every key except exceptionId from alertRuleExceptions
    payload.alertRuleExceptions = payload.alertRuleExceptions.map(({ exceptionId }) => ({ exceptionId }));

    // Remove Every key from destinations except destinationId, severity, closeAfterDelivery, notifyEveryAlert
    payload.destinations = payload.destinations.map(({ destinationId, severity, closeAfterDelivery, notifyEveryAlert }) => ({ destinationId, severity, closeAfterDelivery, notifyEveryAlert }))

    payload = deleteNestedProperty(payload, keysToDelete);

    if (!payload.description) delete payload.description;

    return payload;

}

function filePathGroup(payload) {
    const keysToDelete = [
        "id",
        "customerId",
        "seedId",
        "checkSignature",
        "createdBy",
        "updatedBy",
        "createdAt",
        "updatedAt",
        "links",
    ];
    payload = deleteNestedProperty(payload, keysToDelete);
    if (!payload.description) delete payload.description;
    return payload;
}


function eventExcludeProfile(payload) {
    keysToDelete = [
        "id",
        "customerId",
        "seedId",
        "createdBy",
        "updatedBy",
        "createdAt",
        "updatedAt",
        "custom",
        "resourceType",
        "links",
    ]

    payload = deleteNestedProperty(payload, keysToDelete);
    if (!payload.description) delete payload.description;
    return payload;
}


function customdashboard(payload) {
    keysToDelete = [
        "customerId",
        "seedId",
        "schedules",
        "createdAt",
        "updatedAt",
        "createdBy",
        "updatedBy",
        "lastRunAt",
        "lastRunId",
        "ninetyDayRunCount",
        "links"
    ]
    payload.layout ??= [];
    payload = deleteNestedProperty(payload, keysToDelete);
    if (!payload.description) delete payload.description;
    return payload;
}


function reportSection(payload) {
    keysToDelete = [
        "id",
        "customerId",
        "reportId",
        "createdAt",
        "updatedAt",
        "createdBy",
        "updatedBy",
    ]
    payload = deleteNestedProperty(payload, keysToDelete);
    if (!payload.description) delete payload.description;
    return payload;
}

function yaraRule(payload) {
    keysToDelete = [
        "id",
        "customerId",
        "seedId",
        "createdAt",
        "updatedAt",
        "createdBy",
        "updatedBy",
        "links"
    ]
    payload = deleteNestedProperty(payload, keysToDelete);
    if (!payload.description) delete payload.description;
    if(payload?.FilePathGroupYaraGroupRule) delete payload?.FilePathGroupYaraGroupRule; // when YARA is part of FIM
    return payload;
}



function role(payload) {
    keysToDelete = [
        "id",
        "createdAt",
        "updatedAt",
        "createdBy",
        "updatedBy",
        "roleObjectGroupIds", // asset group ids
        "links"
    ]
    payload = deleteNestedProperty(payload, keysToDelete);
    if (!payload.description) delete payload.description;
    return payload;
}



module.exports = {
    eventRule,
    alertRule,
    filePathGroup,
    eventExcludeProfile,
    customdashboard,
    reportSection,
    yaraRule,
    role,
};
