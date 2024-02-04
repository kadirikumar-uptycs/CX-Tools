const { OAuth2Client } = require('google-auth-library')

const getDecodedOAuthJwtGoogle = async (payload) => {

    const token = payload.credential;

    const CLIENT_ID_GOOGLE = payload.clientId;

    try {
        const client = new OAuth2Client(CLIENT_ID_GOOGLE)

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID_GOOGLE,
        })

        return ticket
    } catch (error) {
        return { status: 500, data: error }
    }
}

module.exports = {getDecodedOAuthJwtGoogle}