const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const dbName = process.env.MONGO_DB_NAME;
const uri = `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`;

module.exports = uri