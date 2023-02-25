require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthorizeUser = (req,res,next) => {
    const {token} = req.headers;
    if(!token){
       return res.status(401).json({error:true,message:"Please authenticate a valid token",status:401});
    }
    try {
        const privateKey = process.env.PRIVATE_KEY
        const decodeToken = jwt.verify(token,privateKey)
        req.credential = decodeToken.id;
        next();
    } catch (error) {
        return res.status(401).json({error:true,message:"Please authenticate a valid token",status:401});   
    }
   
    
}
module.exports = AuthorizeUser;