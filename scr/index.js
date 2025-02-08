import dotenv from "dotenv"
import connectDb from "./db/index.js"
import app from "./app.js"

dotenv.config({
  path:"./.env"
})
 
const PORT=process.env.PORT||8000
// datat base connection
connectDb()
.then(()=>{
  app.on("error",(error)=>{
    console.log("app can not talk to database || error shows up in main index file",error);
    throw error 
  }) 
})
.then(()=>{
  app.listen(PORT,()=>{
    console.log(`server is runing on port ${PORT}`)
  })
})
.catch((err)=>{
  console.error("database error in index file",err)
})

