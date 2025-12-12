import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app=express()

app.use(cors({
   origin: process.env.CORS_ORIGIN,
   credentials:true
}))

app.use(express.json({
  limit:"16kb"
}))

app.use(express.urlencoded({
  limit:"16kb",
  extended:true
}))

app.use(express.static("public"))

app.use(cookieParser())

// router settings
import userrouter from "./routes/user.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import videoRouter from "./routes/video.routes.js"
app.use("/api/v1/users",userrouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/videos",videoRouter)
app.get("/api/v1/helth",async(req,res)=>{
  res.send("ok")
})

export default app