import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
  username:{
    type:String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  fullname:{
    type:String,
    required:true,
    trim:true,
    index:true
  },
  avatar:{
    type:String,// cloud url
    require:true,
  },
  coverImage:{
    type:String,
  },
  watchHistory:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:"Video",
  },
  password:{
    type:String,
    require:[true,"password is required"]
  },
  refreshtoken:{
    type:String
  }
},
{
  timestamps:true
})


export const User = mongoose.model("User",userSchema)