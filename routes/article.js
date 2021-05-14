const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const {User} = require('../models/user')
const multer = require('multer')
const { BlobServiceClient } = require('@azure/storage-blob');
const {uploadImage} = require('../controller/uploadImage');
const {imageList} = require('../controller/imageList');
const {deleteImages} = require('../controller/deleteImages')
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty({ uploadDir: './imagesPath' });
const fs = require('fs').promises;
const fsd = require('fs');



const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=free4store;AccountKey=247BvoIAXMV2dzQIiSsHhDDiG4mQuFrbK+MHLnzFfzvyd7k8wuYK6wFxiIrqzM5HSRzdHERxRO1K3ba3G+4iYQ==;EndpointSuffix=core.windows.net"
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/')
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+file.originalname)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5
    }

})

router.get('/id/:id',async(req,res)=>{
    let article;
    try{
        article = await Article.findById(req.params.id)
        if(article){
            return res.status(200).send(article)
        }
    }
    catch(err){
        return res.status(400).send("No such article exists")
    }
    
    res.status(400).send("No Such Article Exists")
})
router.get('/user',async(req,res)=>{
    let article;
    // console.log("user article",req.user._id)
    try{
        article = await Article.find({"user._id": req.user._id})
        // console.log("requested by->",req.user._id)
        // console.log("requested articles->",article)
        if(article){
            return res.status(200).send(article)
        }
    }
    catch(err){
        return res.status(400).send("Some Error occured")
    }
    
    res.status(400).send("No Such Article Exists")
})
router.get('/latest',async(req,res)=>{
    let article = await Article.find().select({__v: 0}).sort({'date':-1})
    if(article){
        return res.status(200).send(article)

    }
    res.status(400).send("No Articles Published Yet")
})
router.get('/hottest',async(req,res)=>{
    let article = await Article.find().select({__v: 0}).sort({'likes':-1}).limit(5)
    if(article){
        return res.status(200).send(article)

    }
    res.status(400).send("No Articles Published Yet")
})
// router.post('/publish',upload.single('articleImage'),async(req,res)=>{
router.post('/publish',multipartyMiddleware,async(req,res)=>{
    let article = await Article.findOne({"user._id": req.user._id,title: req.body.title})
    let temp=req.files.articleImage
    if(!article){
        let user = await User.findById(req.user._id)
        let imageName=""
        if(temp){
            imageName = await uploadImage(temp)
        }
        article = new Article ({
            title: req.body.title,
            description: req.body.description,
            coverImage: imageName,
            author: req.body.author,
            user:{
                _id: user._id,
                name: user.first_name
            }
        })
        await article.save()
        const directory = 'imagesPath';
        var dir = './imagesPath';
        fs.rmdir(directory, { recursive: true })
        .then(() => {if (!fsd.existsSync(dir)){
            fsd.mkdirSync(dir);
        }});

            
        imageFiles=[]
        return res.status(200).send(article)

    }
    res.status(400).send("Article with same Title")
})
router.post('/update/:id',upload.single('articleImage'),async(req,res)=>{
    let article = await Article.findById(req.params.id)
    if(!article){
        return res.status(404).send("Article not found")
    }
    const old_imgs = imageList(article["description"]);
    const new_imgs = imageList(req.body.description);
    const delete_imgs = []
    old_imgs.forEach(img=>{
        if(!new_imgs.includes(img)){
            delete_imgs.push(img)
        }
    })
    let imageName=article["coverImage"]
    try{
        
        if(req.file){
            if(article["coverImage"]!==req.file.name){
                delete_imgs.push(article["coverImage"])
                imageName = await uploadImage(req.file)
            }
        }
        const result = await deleteImages(delete_imgs)
        const new_article = await Article.findByIdAndUpdate(req.params.id,{
            $set:{
                title: req.body.title,
                description: req.body.description,
                coverImage: imageName,
                author: req.body.author
            },
            new: true})
        const directory = 'imagesPath';
        fs.rmdir(directory, { recursive: true })
        .then(() => {if (!fsd.existsSync(dir)){
            fsd.mkdirSync(dir);
        }});
        imageFiles=[]
        return res.status(200).send(new_article)
    }
    catch(err){
        console.log(err)
        res.status(400).send({"error":err})
    }
})
router.post('/like',async(req,res)=>{
    let oldArticle = await Article.findById(req.body._id)
    if(oldArticle){
        let newArticle= await Article.findByIdAndUpdate(req.body._id,{
            $set:{
                likes: oldArticle.likes+1
            }
        },{new:true})
        return res.status(200).send(newArticle)
    }
    res.status(400).send("Invalid ! No such article present")
})
router.post('/dislike',async(req,res)=>{
    let oldArticle = await Article.findById(req.body._id)
    if(oldArticle){
        let newArticle= await Article.findByIdAndUpdate(req.body._id,{
            $set:{
                likes: oldArticle.likes>0?oldArticle.likes-1:0
            }
        },{new:true})
        return res.status(200).send(newArticle)
    }
    res.status(400).send("Invalid ! No such article present")
})

router.delete('/delete/:id',async(req,res)=>{
    let article = await Article.findById(req.params.id)
    if(!article){
        return res.status(404).send("Article not found")
    }
    try{
    let imgs = imageList(article["description"])
    if(article["coverImage"]!=="" || article["coverImage"]!==NaN){

        imgs.push(article["coverImage"])
    }
    const result = await deleteImages(imgs)
    const del_article = await Article.findByIdAndRemove({ _id: req.params.id });
    if(del_article){
        res.status(200).send(del_article)
        console.log("Deletion successful")
    }
    else{
        res.status(404).send("Article not found")
        console.log("Deletion Unsuccessful")
    }
    
    }
    catch(err){
        return res.status(400).send({"error":err})
    }

    

    // const blockBlobClient = containerClient.getBlockBlobClient("test.txt")
    // const downloadBlockBlobResponse = await blockBlobClient.download(0);
    // console.log(await streamToString(downloadBlockBlobResponse.readableStreamBody));
    // const blobDeleteResponse = blockBlobClient.delete();
    // console.log((await blobDeleteResponse).clientRequestId);
})
router.get('/nopublish',async(req,res)=>{
    if(imageFiles.length){
        try{
            const result = await deleteImages(imageFiles)
            imageFiles=[]
            return res.status(200).send("Deleted Successfully")
        }
        catch(err){
            console.log(err)
            return res.status(400).send("Deletion UnSuccessfull")
        }

    }
    res.status(200).send("No image was Uploaded")
})

module.exports = router