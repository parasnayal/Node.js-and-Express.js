const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.Each key in our code blogSchema defines a property in our documents which will be cast to its associated SchemaType.
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userID:{
        type:String,
        default:uuidv4
    },
    profileImage:{
        type:String,
        required:true
    }
});
// An instance of a model is called a document.Models are responsible for creating and reading documents from the underlying MongoDB database.The first argument is the singular name of the collection your model is for.
const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;