const { MongoClient, ServerApiVersion } = require('mongodb');
// const MONGODB_PASSWORD = "AkU9Zp0fhoAwZAZJ";
// const uri = `mongodb+srv://kadirikumar:${MONGODB_PASSWORD}@cluster0.ihfhwsd.mongodb.net/?retryWrites=true&w=majority`;
const uri = 'mongodb://localhost:27017';
const dbName = "Uptycs";


async function connect() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB Client created successfull...");
        return client;
    } catch (e) {
        console.log("Error while creating mongoDB client...");
        console.log(e);
    }
}

async function isPresent(collection, query) {
    const documents = await collection.find(query).toArray();
    return (documents.length == 0) ? false : true;
}


async function addRequestedUsersEmail(email) {
    try {
        const client = await connect();
        const db = client.db(dbName)

        const emailsCollection = db.collection('userRequests');

        const document = { "email": email };

        const emailExists = await isPresent(emailsCollection, document);

        if (emailExists) {
            console.log(`${email} already present in the Requested Emails.`)
            return true;
        }

        await emailsCollection.insertOne(document);

        console.log(`${email} added to the list of Requested Emails.`);

        await client.close();
        return true
    }
    catch (e) {
        return false
    }

}




async function isUserExists(userData) {
    const client = await connect();
    const db = client.db(dbName);

    let usersCollection = db.collection('Users');
    isExists = await isPresent(usersCollection, userData);
    await client.close();
    return isExists;
}


module.exports = {
    addRequestedUsersEmail,
    isUserExists,
}

