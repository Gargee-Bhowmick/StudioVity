const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')
async function connectToMongo() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error;
    }
}

module.exports = connectToMongo;
