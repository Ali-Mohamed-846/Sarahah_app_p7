import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
 content :{
    type:String,
 },
 file:{
    type:String,
 },
 senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
     required:true,
  
 },
 receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
     
 }
})

const Message = mongoose.model('Message' , messageSchema)
export default Message