const express = require("express")
const {User} = require ('../models/user')
const router = express.Router()
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')


router.post('/',async (req,res)=>{
    let user= await User.findOne({email: req.body.email})
    if(!user){
        const salt=await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(req.body.password,salt)
        user= new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword,
            isAdmin:true
        })
        await user.save()
        const token= jwt.sign({_id: user._id},"secretJwtPrivateKey_Fatmug")
        return res.status(200).send({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            token: token,
            isAdmin: true

        })
    }
    res.status(400).send('User already registered')
})

module.exports = router