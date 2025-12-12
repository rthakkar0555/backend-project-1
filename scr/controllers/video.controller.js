import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiRespons from "../utils/ApiRespons.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadONCloudinary from "../utils/cloudinary.js";
import { number } from "zod";

const publishAVideo=asyncHandler(async(req,res)=>{
    const owner=req.user._id;
    const {title,description}=req.body;
    const VideoFilePath=req.files?.videoFile[0]?.path;
    const thumbnailPath=req.files?.thumbnail[0]?.path;
    console.log(title,description,VideoFilePath,thumbnailPath)
    if(!title || !description) throw new ApiError(400,"title and description is needed");
    if(!VideoFilePath || ! thumbnailPath) throw new ApiError("video or thumbnail is not provided")
    const videoUpload= await uploadONCloudinary(VideoFilePath)
    const thumbnailUpload= await uploadONCloudinary(thumbnailPath)

    console.log(videoUpload)
   
    const video=await Video.create({
        owner:owner,
        videoFile:videoUpload.url,
        thumbnail:thumbnailUpload.url,
        isPublished:false,
        duration:videoUpload.duration,
        views:true,
        isPublished:false,
        description:description,
        title:title
    })
    res.status(201).json(new ApiRespons(201,video,"video uploaded successfully!"))
    return;    
})

const getAllVideos=asyncHandler(async(req,res)=>{
    let {page=1,limit=10,query,sortBy,sortType,userId} = req.query
    page=Number(page)
    limit=Number(limit)
    const filter={}
    if(query)
        filter.title={$regex:query,$options:"i"};
    if(userId) filter.owner=userId

    const sortOptions={}
    sortOptions[sortBy]=sortType=='asc'?1:-1;
    const videos=await Video.find(filter).sort(sortOptions).skip((page-1)*limit).limit(limit);

    if(!videos) throw new ApiError(404,"videos not found")
    res.status(200).json(new ApiRespons(200,{videos:videos},"videos fatched successfully"))
})

const deleteVideo=asyncHandler(async(req,res)=>{
    const videoId=req.params.videoId;
    if(!videoId) throw new ApiError(400,"please provide videoId")
    await Video.findByIdAndDelete(videoId)
    res.status(202).json(new ApiRespons(202,{},"video deleted successfully"))
})

const  getVideoById=asyncHandler(async(req,res)=>{
    const videoId=req.params.videoId;
    if(!videoId) throw new ApiError(400,"please send the video id")
    const video=await Video.findById(videoId);
    if(!video) throw new ApiError(404,"video is not available")
    res.status(200).json(new ApiRespons(200,video,"Video sent successfully"))
})

const togglePublishStatus=asyncHandler(async(req,res)=>{
    const videoId=req.params.videoId;
    if(!videoId) throw new ApiError(400,"please provide videoid")
    const getvideo=await Video.findById(videoId)
    if(!getvideo) throw new ApiError(404,"video is not available")
    const updateVideoPublishStatus=await Video.findByIdAndUpdate(videoId,{
        $set:{
            isPublished:!getvideo.isPublished
        }
    },{new:true})
    const mess=updateVideoPublishStatus.isPublished?"video is published":"video is not published"
    res.status(200).json(new ApiRespons(200,{},mess))
})

const updateVideo=asyncHandler(async(req,res)=>{
    
})

export { deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
}

