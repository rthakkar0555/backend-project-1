import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadONCloudinary from "../utils/cloudinary.js";
import { userLoginSchema } from "../utils/schema.js";
import ApiRespons from "../utils/ApiRespons.js";
import jwt from "jsonwebtoken";
import { size } from "zod";

const generatAccessAndRefresstoken= async (user)=>{
  console.log(user)
  const accessToken=user.generateAccessToken();
  const refreshToken=user.generateRefreshToken();
  console.log("token are generated");
  user.refreshToken=refreshToken;
  user=await user.save({validateBeforeSave:false})
  console.log(user)
  return {refreshToken,accessToken};
}
const registerUser = asyncHandler(async (req, res) => {
  //to user that server is connected

  // fatching the data
  const { username, email, fullName, password } = req.body;
  console.log("req body info", req.body);
  //if(!username || !email  || !fullName || !password) throw new ApiError(404,"kya haii ye")
  if (
    [username, email, fullName, password].some(
      (element) => element?.trim() === ""
    )
  )
    throw new ApiError(404, "data field is empty");

  // check if user alredy hai ya nahi
  const existeUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existeUser) throw new ApiError(409, "user alredy exist");

  // handling file validation
  console.log("req fiels", req.files);
  const avatarLocalImagePath = req.files?.avatar[0]?.path;
  const coverLocalImagePath = req.files?.coverImage[0]?.path;
  console.log(avatarLocalImagePath);
  if (!avatarLocalImagePath) throw new ApiError(404, "user avatar not found");

  //uplodign file to cloudinary
  // const avatarCloudinaryImg=await uploadONCloudinary(avatarLocalImagePath)
  const avatarCloudinaryImg = await uploadONCloudinary(avatarLocalImagePath);
  const coverCloudinaryImg = await uploadONCloudinary(coverLocalImagePath);

  if (avatarCloudinaryImg) new ApiError(500, "something went worng");
  console.log(coverCloudinaryImg);

  //now data is fatch and we are making entry to database

  const userDBrespons = await User.create({
    fullName,
    avatar: avatarCloudinaryImg.url,
    coverImage: coverCloudinaryImg?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // now we are giving the res to user that what we save but hiding password and refrestokan we are alos chaking //if user is saved or not

  const createdUser = await User.findById(userDBrespons._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "someting went wrong we cant connect to user");

  // now we are giving respons
  return res
    .status(201)
    .json(new ApiRespons(201, createdUser, "user registerd successfully"));
});

const loginUser = asyncHandler(async (req, res) => {

  const result = userLoginSchema.safeParse(req.body);
 
  if (!result.success) {
    throw new ApiError(400,"credential are required");
  }

  const data = result.data;

  const { email, username, password } = data;
  console.log(email, username, password);

  if ([email, username, password].some((item) => item?.trim() === ""))
    throw new ApiError(401, "credential are required");

  const user=await User.findOne({
    $or:[{email},{username}]
  })

  if(!user) throw new ApiError(404,"user not exists")

  console.log(user)
  
  const isPasswordCorrect=await user.isPasswordCorrect(password)

  if(!isPasswordCorrect) throw new ApiError(401,"invalid credantial")
  const {refreshToken,accessToken}=await generatAccessAndRefresstoken(user)
  const option={
    httpOnly:true,
    secure:false,
  }
  const loggedinUser= await User.findById(user._id).select("-password -refreshToken");

 
  return res.
  status(201).
  cookie("accessToken",accessToken,option).
  cookie("refreshToken",refreshToken,option).
  json(new ApiRespons(201,{loggedinUser,accessToken,refreshToken},"user is loggedin"))

});

const logoutUser=asyncHandler(async (req,res)=>{
  const user=req.user
  await User.findByIdAndUpdate(user._id,{
    $unset:{
      refreshToken:1
    }
  },{
    new:true
  })
  const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiRespons(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
  const currentrefreshToken=req.cookies.refreshToken;
  console.log("cookies",currentrefreshToken)
  if(!currentrefreshToken) throw new ApiError(400,"unauthorized request")
  const decode=jwt.verify(currentrefreshToken,process.env.REFRESH_TOKEN_SECREAT);
  const user=await User.findById(decode._id);
  console.log(user)
 if(currentrefreshToken!= user.refreshToken) throw new ApiError(400,"unauthorized request token");

  const {refreshToken,accessToken}=await generatAccessAndRefresstoken(user)
  
  const option = {
        httpOnly: true,
        secure: true
    }

  return res.
  status(201).
  cookie("accessToken",accessToken,option).
  cookie("refreshToken",refreshToken,option).
  json(new ApiRespons(201,{accessToken,refreshToken},"refresh token is generated"))
  
})

const changeUserPassword = asyncHandler(async(req,res)=>{
  const {currentPassword,newPassword} =req.body;
  // console.log(currentPassword,newPassword)
  if(!currentPassword || !newPassword) throw new ApiError(400,"unauthorized request")

  const user=await User.findById(req.user._id);

  if(!user) throw new ApiError(400,"user not available");

  if(!await user.isPasswordCorrect(currentPassword)) throw new ApiError(400,"current password is incorrect");

  user.password=newPassword;

  await user.save({validateBeforeSave:false})

  res.status(200).json(new ApiRespons(200,{},"Password change successfully."))

})

const getCurrentUser = asyncHandler(async(req,res)=>{
  const user=req.user;
  if(!user) throw new ApiError(400,"user is not logged in")
  res.status(200).json(new ApiRespons(200,user,"current user fetched successfully"))
})

const updateAvatar=asyncHandler(async(req,res)=>{
 
  const avatarlocalpath=req.file?.path||null;
  if(!avatarlocalpath) throw new ApiError(400,"avatar file is missing")
  console.log(avatarlocalpath)
  const uploadfile=await uploadONCloudinary(avatarlocalpath)
  const url=uploadfile.url
  if(!url) throw new ApiError(500,"cloudinary upload failed");
  const user=await User.findByIdAndUpdate(req.user._id,{
    $set:{
      avatar:url
    }
  },{new:true}).select("-password");
  
  res.status(200).json(new ApiRespons(200,user,"avatar changed successfully"))

})

const getUserChannelProfile = asyncHandler(async (req,res)=>{
   const username = req.params.username?.trim();
   console.log(username);
   const channel= await User.aggregate([
    {
      $match:{
        username:username
      }
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
      },
    },
    {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscriberedTo"
      }
    },
    {
      $addFields:{
        subscriberCount:{
          $size:"$subscribers"
        },
        ChannelSubscribeToCount : {
          $size : "$subscriberedTo",
        },
        isSubscribed:{
          $cond:{
            if:{$in:[req.user._id,"$subscribers.subscriber"]},// revise it again 
             then : true,
             else : false
          }
        }
      }
    },
    {
      $project:{
        fullName : 1,
        username : 1,
        subscriberCount : 1,
        ChannelSubscribeToCount : 1,
        isSubscribed : 1,
        avatar : 1,
        coverImage : 1,
        email : 1,
      }
    }
   ])

   if(!channel?.length)  throw new ApiError(400,"chenal does not exists")
    console.log(channel)
    res.status(200).json(new ApiRespons(200,channel[0],"User chennal fetched successfully"))
})
export { registerUser, loginUser ,logoutUser,refreshAccessToken,changeUserPassword,getCurrentUser,updateAvatar,getUserChannelProfile};
