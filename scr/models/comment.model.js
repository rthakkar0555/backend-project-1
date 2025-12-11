import mongoose from "mongoose";


const commentSchema= new mongoose.Schema({
    content:{
        type:String,
        trim:true,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }

},{timestamps:true})

export const Comment= mongoose.model("Comment",commentSchema)