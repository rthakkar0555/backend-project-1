import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloud url
      require: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Video",
    },
    password: {
      type: String,
      require: [true, "password is required"],
    },
    refreshtoken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id : this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECREAT,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id : this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    },
    process.env.REFRESH_TOKEN_SECREAT,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", userSchema);
