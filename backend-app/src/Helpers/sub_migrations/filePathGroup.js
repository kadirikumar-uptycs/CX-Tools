let helpers = require('../../Helpers');


async function filePathGroup(targetCredentials, payload) {
    let signatureDetails = [];
    let yaraRuleDetails = [];
    if (payload?.signatures?.length) {
        let sourceSignatures = payload?.signatures;

        // GET ALL TARGET SIGNATURES
        let { data: allTargetSignatures } = await helpers.getResources(targetCredentials, 'signatures');
        allTargetSignatures ??= [];

        //  migrate signatures
        for (let signature of sourceSignatures) {
            try {
                let newName = payload?.name + '__' + signature?.name;
                let findSign = allTargetSignatures.find(obj => {
                    const { name, description, paths } = obj;
                    return (name === signature.name || name == newName) && description === signature.description && paths === signature.paths;
                });

                if (findSign) {
                    signatureDetails.push({ id: findSign?.id, 'isCreated': false });
                } else {

                    let signPayload = { 'name': payload?.name + '__' + signature?.name, 'description': signature.description, 'paths': signature.paths };

                    // POST Signature to target
                    let { status, data: signPostResponse } = await helpers.postResources(targetCredentials, signPayload, 'signatures');

                    if (status !== 200) {
                        await deleteSignatures(targetCredentials, signatureDetails.filter(obj => obj.isCreated));
                        return { status, data: `Error while migrating signature ${signature?.name}, ` + signPostResponse.message.detail }
                    }
                    signatureDetails.push({ id: signPostResponse?.id, 'isCreated': true });
                }
            } catch (error) {
                console.log(error);
                return { status: 500, data: `Error while posting signature ${signature?.name}, Error : ${error}` }
            }
        }
        // return { status: 200, data: signatureDetails };

    }

    // migrate yara rules

    if (payload?.yaraGroupRules?.length) {

        let sourceYaraRules = payload.yaraGroupRules;

        // GET all target Yara Rules
        let { data: allTargetYaraRules } = await helpers.getResources(targetCredentials, 'yaraGroupRules');
        allTargetYaraRules ??= [];

        // migrate yara rules

        for (let yaraRule of sourceYaraRules) {
            try {
                let yaraRulePayload = await helpers.payloadFormatter.yaraRule(yaraRule);

                // find if any yaraRule in target with same name
                let findYaraRule = allTargetYaraRules.find(obj => obj.name === yaraRulePayload.name);

                // check if rules are also same for the existing yara rule with same name
                if (!isSameObjects(findYaraRule?.rules, yaraRulePayload?.rules)) {
                    if (findYaraRule) yaraRulePayload.name = payload.name + '__' + yaraRulePayload.name;
                    findYaraRule = undefined;
                }

                if (findYaraRule) {
                    yaraRuleDetails.push({ id: findYaraRule?.id, 'isCreated': false });
                } else {

                    // POST Yara Rule to target
                    let { status, data: yaraRulePostResponse } = await helpers.postResources(targetCredentials, yaraRulePayload, 'yaraGroupRules');

                    if (status !== 200) {
                        await deleteYaraRules(targetCredentials, yaraRuleDetails.filter(obj => obj?.isCreated));
                        return { status, data: `Error while migrating Yara Rule ${yaraRule?.name}, ` + yaraRulePostResponse?.message?.detail }
                    }
                    yaraRuleDetails.push({ id: yaraRulePostResponse?.id, 'isCreated': true });
                }
            } catch (error) {
                console.log(error);
                return { status: 500, data: `Error while posting yara rule ${yaraRule?.name}, Error : ${error}` }
            }
        }
    }

    return { status: 200, data: { signatureDetails, yaraRuleDetails } };
}



async function deleteSignatures(credentials, signatures) {
    for (let sign of signatures) {
        try {
            await helpers.deleteResource(credentials, `signatures/${sign?.id}`);
        } catch (error) {
            return { status: 500, data: `Bad code handling while deleting signature ${sign.name} ` + error };
        }
    }
    return { status: 200, 'data': 'Done!!!' }
}


async function deleteYaraRules(credentials, yaraRules) {
    for (let rule of yaraRules) {
        try {
            await helpers.deleteResource(credentials, `yaraGroupRules/${rule?.id}`);
        } catch (error) {
            return { status: 500, data: `Bad code handling while deleting Yara Rule ${rule?.name} ` + error };
        }
    }
    return { status: 200, 'data': 'Done!!!' }
}

function isSameObjects(obj1, obj2) {
    return obj1 && obj2 && JSON.stringify(obj1) === JSON.stringify(obj2);
}

module.exports = {
    filePathGroup,
    deleteSignatures,
    deleteYaraRules,
};