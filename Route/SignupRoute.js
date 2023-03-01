// Routing refers to how an application's endpoints (URIs) respond to client requests.
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../Images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({
    storage: storage, limits: { fileSize: 2048 }, fileFilter: (req, file, cb) => {
        const { mimetype } = file;
        const isFileImage = mimetype.split("/")[0];
        if (isFileImage === 'image') {
            // To accept the file pass `true`, like so:
            cb(null, true);
        }
        else {
            return cb(new Error("Invalid mime type"));
        }
    }
});

// Returns middleware that processes a single file associated with the given form field.
const uploadSingleImage = upload.single('profileImage');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    api_key: process.env.cloud_api_key,
    api_secret: process.env.cloud_api_secret,
    cloud_name: process.env.cloud_name
})

// routing methods can have more than one callback function as arguments. With multiple callback functions, it is important to provide next as an argument to the callback function and then call next() within the body of the function to hand off control to the next callback.

// You can create chainable route handlers for a route path by using app.route(). Because the path is specified at a single location, creating modular routes is helpful.

// Modular routes in Express.js allow you to organize your routes into separate files, making your code more modular and easier to manage.

// Once you’ve created a router object, you can add middleware and HTTP method routes (such as get, put, post, and so on) to it just like an application.

router.post('/signup', (req, res, next) => {
    uploadSingleImage(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(415).json({ error: true, message: err.message, status: 415 })
        }
        else if (err) {
            return res.status(415).json({ error: true, message: err.message, status: 415 })
        }
        else {
            next();
        }
    })
}, [
    // firstName must be at least 5 chars long
    body('firstName').isLength({ min: 3 }),
    body('lastName').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    // body('profileImage').exists()
], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { firstName, lastName, email, password } = req.body;
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);

        const isUserExists = await userModel.findOne({ email });
        if (isUserExists) {
            return res.json({ "error": "User with this email is already exists" });
        }
        const { path } = req.file;
        const ImageAfterUpload = await cloudinary.uploader.upload(path)
        const { secure_url } = ImageAfterUpload;
        // Two way save data in dbms
        // (1) => create()
        await userModel.create({ email, firstName, lastName, password: hashedPassword, profileImage: secure_url });
        // (2) => save()
        // const user = new userModel({ email, firstName, lastName, password:hashedPassword });
        // const newData = await userModel.save()
        return res.status(201).json({ message: "Account is created successfully", status: 200, error: "false" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", status: 500 });
    }

})

module.exports = router;