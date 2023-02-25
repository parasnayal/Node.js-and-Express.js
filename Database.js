require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
const connectToMongo = async () => {
    try {
        // connect to MongoDB with the mongoose.connect() method.
        await mongoose.connect(url);
    } catch (error) {
        // To handle initial connection errors, you should use .catch() or try/catch with async/await.
        console.log(error)
    }
}

// To handle errors after initial connection was established, you should listen for error events on the connection.
mongoose.connection.on('error', (err) => {
    console.log(err)
})

mongoose.connection.on('connecting', () => {
    // Emitted when Mongoose starts making its initial connection to the MongoDB server
    console.log("Trying to connect")
})
mongoose.connection.on('connected', () => {
    // Emitted when Mongoose starts making its initial connection to the MongoDB server
    console.log("Connected successfully")
})
mongoose.connection.on('disconnecting', () => {
    //  Your app called Connection#close() to disconnect from MongoDB
    console.log("disconnecting")
})
mongoose.connection.on('disconnected', () => {
    //  Emitted when Mongoose lost connection to the MongoDB server.
    console.log("disconnected")
})
mongoose.connection.on('close', () => {
    //  Emitted after Connection#close() successfully closes the connection.
    console.log("close")
})

module.exports = connectToMongo;