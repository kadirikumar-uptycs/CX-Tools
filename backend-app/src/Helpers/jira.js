const getHeaders = () => {
    try {
        let headers = {
            'Authorization': `Basic ${Buffer.from(
                `${process.env.JIRA_EMAIL_ADDRESS}:${process.env.JIRA_API_TOKEN}`
            ).toString('base64')}`,
            'Accept': 'application/json'
        }
        return headers;
    }
    catch (error) {
        console.log("Error while generating headers", error?.message);
    }
}

module.exports = getHeaders;