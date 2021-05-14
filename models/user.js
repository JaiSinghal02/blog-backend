const mongoose = require('mongoose')

const User = mongoose.model('User',new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    last_name:{
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}))

exports.User = User