const mongoose = require('mongoose')

const Article = new mongoose.model('Article',new mongoose.Schema({
    user:{
        _id:{
            type: mongoose.Types.ObjectId,
            required: true
        },
        name:{
            type: String
        }
    },
    title:{
        type: String,
        required: true,
        unqiue: true,
        trim: true,
    },
    author:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    date:{
        type: Date,
        default: Date.now
    },
    likes:{
        type: Number,
        default: 0
    },
    coverImage: { 
        type: String
    }
}))

module.exports = Article