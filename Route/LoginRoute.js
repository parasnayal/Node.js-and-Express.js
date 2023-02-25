require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const userModel = require('../Model/UserModel');
const jwt = require('jsonwebtoken');
const secret_key = process.env.PRIVATE_KEY;

router.post('/login', [
    body('email').isEmail(),
    body('password').exists({ checkFalsy: true })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    else {
        try {
            const { email, password } = req.body;
            const isUserExists = await userModel.findOne({ email });
            if (!isUserExists) {
                return res.status(400).json({ message: "user with this email not exists" });
            }
            const isPasswordMatched = await bcrypt.compare(password, isUserExists.password)
            if (!isPasswordMatched) {
                return res.status(401).json({ message: "email or password is not correct", status: 401, error: true });
            }
            const payload = { id: isUserExists.userID };
            const token = jwt.sign(payload, secret_key, { algorithm: 'HS256' });
            return res.status(200).json({ message: "Successfully login", status: 200, error: false, payload: token });
        } catch (error) {
            res.status(500).json({ error:true, message: "Internal server error" ,status:500});
        }
    }

})
module.exports = router;