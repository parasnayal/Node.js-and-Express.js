// Loads .env file contents into process.env.
// returns an object with a parsed key if successful or error key if an error occurred.
require("dotenv").config();
const express = require("express");
const connectToMongo = require('./Database');
const port = process.env.PORT;
const bodyParser = require("body-parser");
// Creates an Express application.
const app = express();

connectToMongo();

app.use(bodyParser.json());

app.use('/api/auth',require('./Route/SignupRoute'));
app.use('/api/auth',require('./Route/LoginRoute'));
app.use('/api',require('./Route/ForgotPassword'));
app.use('/api',require('./Route/ResetPassword'));

app.listen(port, () => {
    console.log(`Example app running at http://localhost:${port}`);
});