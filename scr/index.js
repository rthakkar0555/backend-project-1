import dotenv from "dotenv"
import connectDb from "./db/index.js"
import express from "express"
const app = express()

dotenv.config({
  path:"./.env"
})

// datat base connection
connectDb();

