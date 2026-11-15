import {Router} from "express";
import * as messageService from "./message.service.js"
import { multerUpload } from "../../Middlewares/multer.middleware.js";
import { BadRequestException } from "../../common/Utils/Errors/exception.error.js";
import { authenticate } from "../../Middlewares/authentication.middleware.js";
const router = Router()

router.post("/send" ,authenticate ,multerUpload({desiredPath:"messages"}).single('file'), async (req,res)=>{
const {content , receiverId} = req.body
const file = req.file
const senderId = req.authUser._id
if (!content && !file) {
    throw new BadRequestException("Content or file is required " ,null ,"CONTENT_OR_FILE_REQUIRED")
}
const result = await messageService.sendMessage({content, file ,receiverId,senderId})
res.status(201).json({message:"Message sent successfully" ,data:result})
})

router.get("/receiver" ,authenticate, async (req,res)=>{

const result = await messageService.getMessageByReceiverId(req.authUser._id)
res.json({message:"Message retrieved successfully" ,data:result})
})


router.post("/request" ,authenticate, async (req,res)=>{
const {messageId} = req.body
const result = await messageService.askForSenderIdentity(messageId,req.authUser._id)
res.json({message:"Request sent successfully" ,data:result})
})

router.get("/requests" ,authenticate, async (req,res)=>{
const result = await messageService.getAllRequests(req.authUser._id)
res.json({message:"All Requests" ,data:result})
})
router.patch("/changestatus" ,authenticate, async (req,res)=>{
    const {requestId , status} = req.body
const result = await messageService.changeRequestStatus({requestId,status})
res.json(result)
})
router.post("/send-message-conversation/:conversationId" ,authenticate,multerUpload({desiredPath:"messages"}).single('file'), async (req,res)=>{
 const { conversationId } = req.params;
const {content } = req.body
const file = req.file
const senderId = req.authUser._id
if (!content && !file) {
    throw new BadRequestException("Content or file is required " ,null ,"CONTENT_OR_FILE_REQUIRED")
}
const result = await messageService.sendConversationMessage({conversationId,senderId,content,file})
res.json({message:"message sent inside conversation successfully",result})
})
router.get("/get-conversation-message/:conversationId" ,authenticate, async (req,res)=>{
 const { conversationId } = req.params;
 const userId = req.authUser._id
const result = await messageService.getConversationMessages({conversationId,userId})
res.json(result)
})
export default router