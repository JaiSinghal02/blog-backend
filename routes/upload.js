const express = require('express')
const router = express.Router()
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty({ uploadDir: './imagesPath' });
const {uploadImage} = require('../controller/uploadImage')


router.post('/',multipartyMiddleware,async (req,res)=>{
    let temp=req.files.upload
    console.log("temp->",temp);
    // const pathURL= path.join(__dirname,"./uploads/"+temp.name+Date.now())
    // fs.rename(temp.path,pathURL,err=>{
    //     res.status(200).json({
    //         uploaded: true,
    //         url: `${pathURL}`
    //     })
    // })
    
    // console.log(req.files.upload);
    // Create the BlobServiceClient object which will be used to create a container client
    let blobName
    try{

        blobName = await uploadImage(temp)
        imageFiles.push(blobName)
    }
    catch(err){
        return res.status(400).send({"error":err})  
    }
    res.status(200).json({
                uploaded: true,
                url: `https://free4store.blob.core.windows.net/blog-images/${blobName}`
            })
})

module.exports = router