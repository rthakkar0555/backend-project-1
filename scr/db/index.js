import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"
const connectDb =  async() => {
    try{
    let dataBaseConnectionInstanse = await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`hogay bhai ${dataBaseConnectionInstanse.connection.host}`)
    return dataBaseConnectionInstanse 
    }
    catch(error){
        console.error("error agai bhai database connection mai::",error);
        process.exit(1);
    }
   x
}

export default connectDb
