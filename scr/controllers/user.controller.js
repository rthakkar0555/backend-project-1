import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import uploadONCloudinary from "../utils/cloudinary.js"
import ApiRespons from "../utils/ApiRespons.js"

export const registerUser = asyncHandler(async (req,res)=>{
  //to user that server is connected

  // fatching the data
  const {username,email,fullName,password}=req.body
  console.log("req body info",req.body)
  //if(!username || !email  || !fullName || !password) throw new ApiError(404,"kya haii ye")
  if(
    [username,email,fullName,password].some((element)=>element?.trim() === "")
  ) throw new ApiError(404,"data field is empty")
  
  // check if user alredy hai ya nahi
  const existeUser=await User.findOne({
    $or:[{username},{email}]
  });
 console.log(existeUser)
  if(existeUser) throw new ApiError(409,"user alredy exist")

  // handling file validation
  console.log("req fiels",req.files) 
  const avatarLocalImagePath =  req.files?.avatar[0]?.path
  const coverLocalImagePath =  req.files?.coverImage[0]?.path
  console.log(avatarLocalImagePath)
  if(!avatarLocalImagePath) throw new ApiError(404,"user avatar not found")
  
  //uplodign file to cloudinary
 // const avatarCloudinaryImg=await uploadONCloudinary(avatarLocalImagePath)
  const avatarCloudinaryImg=await uploadONCloudinary(avatarLocalImagePath)
  const coverCloudinaryImg=await uploadONCloudinary(coverLocalImagePath)

  if(avatarCloudinaryImg) new ApiError(500,"something went worng")
  console.log(coverCloudinaryImg)
  
  //now data is fatch and we are making entry to database

  const userDBrespons= await User.create({
    fullName,
    avatar: avatarCloudinaryImg.url,
    coverImage: coverCloudinaryImg?.url||"",
    email,
    password,
    username:username.toLowerCase()
  });
   // now we are giving the res to user that what we save but hiding password and refrestokan we are alos chaking //if user is saved or not 

  const createdUser= await User.findById(userDBrespons._id).select("-password -refreshToken")

  if(!createdUser) throw new ApiError(500,"someting went wrong we cant connect to user")

  // now we are giving respons
  return res.status(201).json(
    new ApiRespons(201,createdUser,"user registerd successfully")
  )
});

export default registerUser