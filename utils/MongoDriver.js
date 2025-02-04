const { MongoClient } = require('mongodb');

class MongoDriver {
    static async createConnection(DatabaseUrl, DBName) {
        try {
            const client = new MongoClient(DatabaseUrl);
            await client.connect();
            return client.db(DBName);
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    }

     static async getCollections(db) {
        try {
            return await global.DBConnection[db].listCollections().toArray();
        } catch (error) {
            console.error("Error connecting to collection data MongoDB:", error);
            return false;
        }
     }
}

module.exports = MongoDriver;  // Pastikan ini benar
