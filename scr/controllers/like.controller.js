import mongoose from "mongoose";
import { Like } from "../models/likes.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiRespons from "../utils/ApiRespons.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoLike=asyncHandler(async (req,res)=>{
    const videoId=req.params.videoId;
    let resObj={}
    let mess="unliked";
    if(!videoId) throw new ApiError(400,"provide Video id")
    const userID=req.user._id;
    console.log(userID)
    let like=await Like.findOne({likeBy:userID,video:videoId})
    if(!like){
        resObj=await Like.create({likeBy:userID,video:videoId})
        mess="liked"
    }    
    else await Like.findByIdAndDelete(like._id)
    res.status(200).json(new ApiRespons(200,resObj,mess))
})

const toggleCommentLike=asyncHandler(async(req,res)=>{
    const commentId=req.params.commentId;
    let resObj={}
    let mess=""
    if(!commentId) throw new ApiError(400,"comment id is needed")
    const userId=req.user._id

    let IscommentLiked=await Like.findOne({comment:commentId,likeBy:userId})
    if(!IscommentLiked){
        resObj=await Like.create({likeBy:userId,comment:commentId})
        mess="comment is liked"
    }
    else{
        await Like.findByIdAndDelete(IscommentLiked._id)
        mess="comment like is removed"
    }
    res.status(200).json(new ApiRespons(200,resObj,mess))
})

const toggleTweetLike=asyncHandler(async(req,res)=>{
    const tweetId=req.params.tweetId;
    let resObj={}
    let mess=""
    if(!tweetId) throw new ApiError(400,"comment id is needed")
    const userId=req.user._id

    let IstweetLiked=await Like.findOne({tweet:tweetId,likeBy:userId})
    if(!IstweetLiked){
        resObj=await Like.create({tweet:tweetId,likeBy:userId})
        mess="tweet is liked"
    }
    else{
        await Like.findByIdAndDelete(IstweetLiked._id)
        mess="tweet like is removed"
    }
    res.status(200).json(new ApiRespons(200,resObj,mess))
})

const getLikedVideos=asyncHandler(async(req,res)=>{
    const user=req.user;
    const userLikedVideos=await Like.find({
        likeBy:user._id,
        video:{$exists: true,$ne:null}
    })
    res.status(200).json(new ApiRespons(200,userLikedVideos,"all user liked video are fathed successfully"))
})

export {getLikedVideos,toggleCommentLike,toggleVideoLike,toggleTweetLike}