import { MongoClient } from 'mongodb';
import config from './config.js';

class Database {
    constructor() {
        this.dbClient = new MongoClient(config.dbURL);
        this.dbName = config.dbName;
        this.collectionName = config.collection;
    }

    async connect() {
        await this.dbClient.connect();
        this.db = this.dbClient.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);
        console.log('Connected to the database');
    }

    async disconnect() {
        await this.dbClient.close();
        console.log('Disconnected from the database');
    }

    async getCollection(collectionName) {
        return this.db.collection(collectionName);
    }

    async getAllUsers() {
        return await this.collection.find().toArray();
    }
}

export default Database;
