const { BlobServiceClient } = require('@azure/storage-blob');
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=free4store;AccountKey=247BvoIAXMV2dzQIiSsHhDDiG4mQuFrbK+MHLnzFfzvyd7k8wuYK6wFxiIrqzM5HSRzdHERxRO1K3ba3G+4iYQ==;EndpointSuffix=core.windows.net"


module.exports.deleteImages = async function (imgs){
    try{
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient("blog-images");
        let result
        imgs.forEach(img=>{
            result=containerClient.deleteBlob(img)
        })
        await result;
        return result
    }
    catch(err){
        return new Error(err)
    }
}