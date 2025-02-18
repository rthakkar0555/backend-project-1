import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
  api_key: `${process.env.CLOUDINARY_CLOUD_API_KEY}`, 
  api_secret: `${process.env.CLOUDINARY_CLOUD_SECREAT}`
});

const uploadONCloudinary= async(localpath)=>{
  try{
    console.log(process.env.CLOUDINARY_CLOUD_NAME,process.env.CLOUDINARY_CLOUD_API_KEY,process.env.CLOUDINARY_CLOUD_SECREAT )
    console.log(localpath)
    if(!localpath) return null
    const respons=await cloudinary.uploader.upload(localpath,{
      resource_type:"auto"
    })
    console.log("file upload to cloud",respons.url)
    return respons;
  }
  catch(error){
    console.log(error)
    fs.unlinkSync(localpath) // remove locally if fails
    return null
  }
}

export default uploadONCloudinary