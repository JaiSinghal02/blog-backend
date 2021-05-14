
module.exports.imageList = function(articleDescription){
    let desc = articleDescription
        let start = 0;
        let imgs=[]
        while(true && start<desc.length){
            let st=desc.slice(start);
            let start_pointer = st.search("img")
            if(start_pointer === -1){
                break;
            }
            else{
                let src_check=st.slice(start_pointer+4,start_pointer+7) //this is src
                if(src_check !== "src"){
                    break;
                }
                let nst=st.slice(start_pointer+62); //this is start of image name
                let endpos= nst.search(`">`) //searching end of image name
                if(endpos === -1){
                    break;
                }
                let img=nst.slice(0,endpos) //this is the image name
                imgs.push(img)
                start+=start_pointer+endpos+62
                
            }
        }
        return imgs
}
