import mongoose  from "mongoose";
import { refine, trim } from "zod";

const playlistSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:true
    },
    description:{
        type:String,
        trim:true,
        require:true
    },
    videos:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Video"
    },
    owner:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User"
    }

},{timestamps:true})

export const Playlist= mongoose.model("Playlist",playlistSchema)