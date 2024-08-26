const { MongoClient } = require('mongodb');

let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        console.log('Using cached MongoDB connection.');
        return cachedDb;
    }

    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);

        cachedDb = client.db('RQ_Analytics');
        console.log('MongoDB connected successfully!');
        return cachedDb;
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
