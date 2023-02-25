const mongoose = require('mongoose');
const { Schema } = mongoose;
const userModel = require('./UserModel')

const tokenSchema = new Schema({
    userId: {
        type: String,
        required: true, 
        ref: 'userModel'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});
const tokenModel = mongoose.model('tokenModel', tokenSchema);
module.exports = tokenModel;