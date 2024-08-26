const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        const uri = 'mongodb://localhost:27017/mydatabase'; 

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToDatabase;
