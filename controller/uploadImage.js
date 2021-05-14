const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs')
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=free4store;AccountKey=247BvoIAXMV2dzQIiSsHhDDiG4mQuFrbK+MHLnzFfzvyd7k8wuYK6wFxiIrqzM5HSRzdHERxRO1K3ba3G+4iYQ==;EndpointSuffix=core.windows.net"

module.exports.uploadImage = async function (file){
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    const containerName = "blog-images";

    // Referencing container
    const containerClient = blobServiceClient.getContainerClient(containerName);
    //setting image name
    const blobName = Date.now()+file.name;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log('\nUploading to Azure storage as blob:\n\t', blobName);

    // Upload data to the blob
    var data;
    data= fs.readFileSync(file.path)

    console.log("FILE IS READ..........")
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
    return blobName;
}