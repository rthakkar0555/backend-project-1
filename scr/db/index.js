import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"
const connectDb =  async() => {
    try{
    let dataBaseConnectionInstanse = await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`hogay bhai ${dataBaseConnectionInstanse.connection.host}`)
    }
    catch(error){
        console.error("error in database db folder in index file while connecting with database",error);
        process.exit(1);
    }
 
}

export default connectDb
