import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiRespons from "../utils/ApiRespons.js";
import asyncHandler from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!videoId) throw new ApiError(400,"video ID is not provided")
    const videoComments=await Comment.find({video:videoId}).skip((page-1)*limit).limit(limit)
    res.status(200).json(new ApiRespons(200,videoComments,"all video comments"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const videoId=req.params.videoId;
    const content=req.body.content;
    if(!videoId) throw new ApiError(400,"video ID is not provided")
    if(!content) throw new ApiError(400,"content not provided")
    const comment=await Comment.create({owner:req.user._id,video:videoId,content:content})
    res.status(200).json(new ApiRespons(200,comment,"comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const content=req.body.content;
    const commentId=req.params.commentId
    if(!content) throw new ApiError(400,"content is not provided")
    if(!commentId) throw new ApiError(400,"commentod is not provided")
    const updatedComment= await Comment.findByIdAndUpdate(commentId,{
        $set:{
            content:content
        }
    },{new:true})
    res.status(200).json(new ApiRespons(200,updatedComment,"comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const commentId=req.params.commentId
    if(!commentId) throw new ApiError(400,"comment is not provided")   
    await Comment.findByIdAndDelete(commentId)
    res.status(202).json(new ApiRespons(202,"comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
