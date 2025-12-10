import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'

const authMiddlerware = asyncHandler(async(req,res,next)=>{
   try{
     const accessToken=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
     console.log(accessToken)
    const decode=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECREAT)

    const user=await User.findById(decode._id)

    if(!user) throw new ApiError(401,"invalid accesstoken")
    console.log(user)
    
    req.user=user

    next()

   }catch{
    throw new ApiError(401,"invalid accesstoken")
   }
})

export default authMiddlerware