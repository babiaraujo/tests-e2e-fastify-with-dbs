import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); 

const dbURL = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;
const isTestEnv = process.env.NODE_ENV === 'test';

const log = (...args) => !isTestEnv && console.log(...args);

async function runSeed() {
    const client = new MongoClient(dbURL);
    try {
        await client.connect();
        log(`Db connected successfully to ${dbName}!`);

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        await collection.deleteMany({});
        await collection.insertMany(users); 

        const allUsers = await collection.find().toArray();
        log(allUsers);
    } catch (err) {
        console.error(err.stack); 
    } finally {
        await client.close();
    }
}

if (!isTestEnv) {
    runSeed().catch(console.error); 
}

export { runSeed };
