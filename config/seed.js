import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseSeeder {
    constructor() {
        this.dbURL = process.env.DB_URL;
        this.dbName = process.env.DB_NAME;
        this.collectionName = process.env.COLLECTION_NAME;
        this.isTestEnv = process.env.NODE_ENV === 'test';
    }

    log(...args) {
        if (!this.isTestEnv) {
            console.log(...args);
        }
    }

    async runSeed() {
        const client = new MongoClient(this.dbURL);
        try {
            await client.connect();
            this.log(`Db connected successfully to ${this.dbName}!`);

            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);

            await collection.deleteMany({});
            await collection.insertMany(users);

            const allUsers = await collection.find().toArray();
            this.log(allUsers);
        } catch (err) {
            console.error(err.stack);
        } finally {
            await client.close();
        }
    }
}

const databaseSeeder = new DatabaseSeeder();

if (!databaseSeeder.isTestEnv) {
    databaseSeeder.runSeed().catch(console.error);
}

export { DatabaseSeeder };
