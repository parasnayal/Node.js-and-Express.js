require('dotenv').config();
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../Model/UserModel');
const tokenModel = require('../Model/TokenModel');
const crypto = require('crypto-js');
const handleEmail = require('../Email/Email');

router.post('/forgot-password', [
    body('email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { email } = req.body;
        const isUserExists = await userModel.findOne({ email });
        if (!isUserExists) {
            return res.status(400).json({ error: "User with this email is not exists", status: 400 });
        }
        const generateToken = crypto.AES.encrypt('my message', 'secret key 123').toString();
        const token = await tokenModel.findOne({ userId: isUserExists.userID });
        if (token) {
            const afterDelete = await token.deleteOne()
            console.log(afterDelete, 'afterDelete')
        }
        const afterTokenCreate = await tokenModel.create({
            userId: isUserExists.userID,
            token: generateToken,
            createdAt: Date.now()
        })
        console.log(afterTokenCreate, 'afterTokenCreate');
        await handleEmail(isUserExists.userID, email, token)
        return res.status(200).json({ error: false, message: "To reset the password link is send at your email address", status: 200 })
    } catch (error) {
        console.log(error)
        return error
    }
})
module.exports = router;