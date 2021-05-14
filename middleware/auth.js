const jwt = require('jsonwebtoken')


function auth (req,res,next){
    const token =req.header('x-auth-token')
    console.log("TOKEN",token)
    if(!token) return res.status(401).send("Un-Authenticated User")

    try{
        const user=jwt.verify(token,"secretJwtPrivateKey_ProtonAutoML")
        console.log("user->",user)
        req.user=user
        // console.log("INSIDE AUTH",req.user)
        next()
    }
    catch(err){
        console.log("Invalid")
        res.status(400).send("Invalid Token")
    }
}

module.exports = auth