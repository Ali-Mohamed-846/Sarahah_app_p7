import mongoose from "mongoose";
import { requestStatusEnum } from "../../common/constants.js";


const  requestsSchema = new mongoose.Schema({

    messageId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Message',
        required:true,
        
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
        
    },
    status :{
       type: String,
             enum:Object.values(requestStatusEnum) ,
             default: requestStatusEnum.PENDING
    }
})

const Requests = mongoose.model('Requests' , requestsSchema)
export default Requests