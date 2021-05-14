const express = require('express')
const mongoose=require('mongoose');
const {User} = require('./models/user')
const user = require('./routes/user')
const auth = require('./routes/auth')
const article = require('./routes/article')
const upload = require('./routes/upload')
const authMiddleWare = require('./middleware/auth')
const cors = require('cors')
const app = express();
global.imageFiles=[]
// mongoose.connect('mongodb://localhost/blog',{useNewUrlParser: true,useUnifiedTopology: true})
mongoose.connect('mongodb+srv://Jai-Singhal:Mongodbsinghal@02@cluster0.rwdlf.mongodb.net/MongoDataBase?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology: true })
 .then(()=> console.log('Connected to mongodb server...'))
 .catch(err=> console.error('Error connecting:',err.message));
var corsOptions = {
    origin: 'http://localhost:3000', //https://jaisinghal02.github.io
  }
  app.get('/',(req,res)=>{
      res.send("This is API for Blog")
  })
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static("uploads"))
app.use('/upload/image',upload)
app.use('/api/signup',user)
app.use('/api/signin',auth)
app.use('/uploads',express.static('uploads'))
app.use('/api/article',authMiddleWare)
app.use('/api/article',article)
app.get('/admincheck',authMiddleWare,async(req,res)=>{
    console.log(req.user)
    let user= await User.findById(req.user._id)
    console.log(user)
    res.status(200).send(user.isAdmin)
})

const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Server running at port ${5000}..`)
})