import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadONCloudinary = async (localpath) => {
  try {
    cloudinary.config({
      cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
      api_key: `${process.env.CLOUDINARY_API_KEY}`,
      api_secret: `${process.env.CLOUDINARY_API_SECREAT}`,
    });
    console.log(cloudinary.config());
    console.log(localpath);
    if (!localpath) return null;
    const respons = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    console.log("file upload to cloud", respons.url);
    fs.unlinkSync(localpath);
    return respons;
  } catch (error) {
    console.log("error in cloudinary: ", error);
    fs.unlinkSync(localpath); // remove locally if fails
    return null;
  }
};

export default uploadONCloudinary;
