const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDB = async() => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    try {
        await mongoose.connect(process.env.DB, connectionParams);
        console.log("Connected to database successfully");
    } catch (error) {
        console.log("Some error connecting to database");
        console.error(error);
    }
};

module.exports = connectDB;