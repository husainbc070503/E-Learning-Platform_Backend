const mongoose = require('mongoose');
const url = process.env.MONGODB_URL

const connectToMongoDB = async () => {
    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect(url, () => console.log('MongoDB Connected Successfully!!'));
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectToMongoDB;