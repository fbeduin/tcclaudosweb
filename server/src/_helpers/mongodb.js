const { MongoClient } = require('mongodb');

let db;
exports.connect = async () => {
    if (db) return db;

    const client = new MongoClient(process.env.MONGO_HOST);
    await client.connect();

    db = client.db(process.env.MONGO_DATABASE);
    return db;
}