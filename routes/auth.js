const express = require("express")
const {User} = require ('../models/user')
const router = express.Router()
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/',async (req,res)=>{
    let user= await User.findOne({email: req.body.email})
    if(user){
        const validatePassword = await bcrypt.compare(req.body.password,user.password)
        if(validatePassword){
            const token= jwt.sign({_id: user._id},"secretJwtPrivateKey_ProtonAutoML")
            return res.status(200).send({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                token: token,
                isAdmin: user.isAdmin
    
            })
        }
        
    }
    res.status(400).send('Invalid Email or Password')
})

module.exports =router