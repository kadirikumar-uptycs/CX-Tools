const { MongoClient, ServerApiVersion } = require('mongodb');
const dbName = "Uptycs";

function getmongoURI() {
    const userName = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    const uri = `mongodb+srv://${userName}:${password}@cluster0.ihfhwsd.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    return uri;
}

let uri = getmongoURI();


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


async function getUsers() {
    try {
        const client = await connect();
        const db = client.db(dbName);

        let usersCollection = db.collection('Users');
        const documents = await usersCollection.find({}).toArray();
        await client.close();
        return documents;
    } catch (error) {
        console.log(error);
        return null
    }
}


async function addNewUser(document) {
    try {
        const client = await connect();
        const db = client.db(dbName);

        let usersCollection = db.collection('Users');
        let response = await usersCollection.insertOne(document);
        await client.close();
        return { status: 200, data: response };
    } catch (error) {
        console.log(error);
        return { status: 500, data: error };
    }
}


async function updateUserInfo(document) {
    try {
        const client = await connect();
        const db = client.db(dbName);

        const updateData = {
            $set: {
                'profile': document?.picture,
            }
        };

        let usersCollection = db.collection('Users');
        let response = await usersCollection.updateOne({ 'email': document?.email }, updateData);
        console.log('Updated User Details.');
        await client.close();
        return { status: 200, data: response };
    } catch (error) {
        console.log('Error while updating user details')
        console.log(error);
        return { status: 500, data: error };
    }
}

async function isUserExists(userData) {
    try {
        const client = await connect();
        const db = client.db(dbName);

        let usersCollection = db.collection('Users');
        isExists = await isPresent(usersCollection, userData);
        await client.close();
        return isExists;
    } catch (error) {
        return false;
    }
}


module.exports = {
    addRequestedUsersEmail,
    isUserExists,
    getUsers,
    addNewUser,
    updateUserInfo,
    getmongoURI,
}

