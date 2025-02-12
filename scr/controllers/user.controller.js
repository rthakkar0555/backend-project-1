import asyncHandler from "../utils/asyncHandler.js"


let registerUser = asyncHandler((req,res)=>{
  res.status(200).json({
    message:"done"
  })
})

export default registerUser