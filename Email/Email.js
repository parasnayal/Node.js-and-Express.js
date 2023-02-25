require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const handleEmail = async (userID, email, token) => {
    try {
        // This module comes with an OAuth2 client that allows you to retrieve an access token, refresh it, and retry the request seamlessly.
        const oauth2Client = new google.auth.OAuth2({
            clientId: process.env.clientID,
            clientSecret: process.env.clientSecret,
            redirectUri: process.env.redirectUri
        });
        oauth2Client.setCredentials({ refresh_token: process.env.refershToken });
        const accessToken = await oauth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: "parasnayal955@gmail.com",
                clientId: process.env.clientID,
                clientSecret: process.env.clientSecret,
                refreshToken: process.env.refershToken,
                accessToken: accessToken
            }
        })
        const result = await transport.sendMail({
            from: 'parasnayal955@gmail.com',
            to: email,
            subject: "Password Reset",
            text: 'Please reset the password using this link',
            html: `<p>Click <a href="http://localhost:3000/api/resetPassword?token=${token}&id=${userID}'">here</a> to reset your password</p>`,
        })
        return result;
    } catch (error) {
        return error
    }

}
module.exports = handleEmail;