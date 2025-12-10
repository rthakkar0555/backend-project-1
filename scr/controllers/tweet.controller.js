import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiRespons from "../utils/ApiRespons.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const user=req.user;
    if(!content) throw new ApiError(400,"content is not provided");
    const tweet = await Tweet.create({
        owner:user._id,
        content:content
    })
    res.status(200).json(new ApiRespons(200,tweet,"tweet created succefully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userid=req.params.userId
    // const tweetCount = await Tweet.countDocuments({ owner: user._id });
    const userTweets = await Tweet.find({ owner: userid }).sort({ createdAt: -1 });
    res.status(200).json(new ApiRespons(200,{tweets:userTweets,tweetCount:userTweets.length},"all tweet of user"))
    // const tweets=await User.aggregate([
    //     {
    //         $match:{
    //             _id: new mongoose.Types.ObjectId(user._id)
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:"Tweet",
    //             localField:"_id",
    //             foreignField:"owner",
    //             as:"usertweets"
    //         }
    //     },
    //     {
    //         $addFields:{
    //             totalTweetCount:{
    //                 $size:"$usertweets"
    //             }
    //         }
    //     },
    //     {
    //         $project:{
    //             _id:1,
    //             username:1,
    //             fullname:1,
    //             avatar:1,
    //             totalTweetCount:1,
    //             usertweets:1
    //         }
    //     }
    // ])
    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content}=req.body
    const id=req.params.tweetId
    if(!id || !content) throw new ApiError(400,"id or content is not provided")
    const tweet=await Tweet.findByIdAndUpdate(id,{
        $set:{
            content:content
        }
    },{new:true})

    res.status(200).json(new ApiRespons(200,tweet,"tweet updated succesfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweetId=req.params.tweetId;
    if(!tweetId) throw new ApiError(400,"tweet id is not provided")
    await Tweet.findByIdAndDelete(tweetId)
    res.status(202).json(new ApiRespons(202,{},"tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}