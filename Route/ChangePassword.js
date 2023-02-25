// For changing the password login is required
const express = require('express');
const router = express.Router();
const userModel = require('../Model/UserModel');
const { body, validationResult } = require('express-validator');
const AuthorizeUser = require('../Middleware/AuthorizeUser');
const bcrypt = require('bcrypt');
router.post('/changePassword', AuthorizeUser, [
    body('password').exists(),
    body('newPassword').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const { password, newPassword } = req.body;
        const { credential } = req;
        const isUserExists = await userModel.findOne({ credential });
        const isPasswordMatched = await bcrypt.compare(password, isUserExists.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ error: false, message: "Your old password is incorrect", status: 401 });
        }
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, genSalt);
        await userModel.updateOne({credential},{$set:{password:hashedPassword}});
        return res.status(200).json({ error: false, message: "Password is updated successfully", status: 200 });
    } catch (error) {

    }
})
module.exports = router;