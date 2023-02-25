const express = require('express');
const tokenModel = require('../Model/TokenModel');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../Model/UserModel');
const bcrypt = require('bcrypt');
router.post('/resetPassword', [
    body('password').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { token, id } = req.query;
        const { password } = req.body;
        const isUserExists = await tokenModel.findOne({ id });
        console.log(id,password,token)
        console.log(isUserExists)
        if (!isUserExists) {
            return res.status(400).json({ error: "Invalid or password reset token", status: 400 });
        }
        const isTokenValid = await tokenModel.findOne({ token: { $eq: token } });
        console.log(isTokenValid)
        if (!isTokenValid) {
            return res.status(400).json({ error: "Invalid or password reset token", status: 400 });
        }
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt)
        const resultAfterUpdatingPassword = await userModel.updateOne({ userID:id }, { $set: { password:hashedPassword } });
        console.log(resultAfterUpdatingPassword, 'resultAfterUpdatingPassword');
        return res.status(200).json({ error: false, message: "Password is updated successfully", status: 200 });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", status: 500 });
    }

});
module.exports = router;