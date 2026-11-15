import { BadRequestException, NotFoundException } from "../../common/Utils/Errors/exception.error.js"
import conversationRepository from "../../DB/Repositories/conversation.repository.js"
import conversationMessageRepository from "../../DB/Repositories/conversationmessage.repository.js"
import MessageRepository from "../../DB/Repositories/message.repository.js"
import RequestsRepository from "../../DB/Repositories/requests.repository.js"
import UserRepository from "../../DB/Repositories/user.repository.js"
const userRepo = new UserRepository()
const messageRepository =new MessageRepository()
const requestsRepository =new RequestsRepository()
const conversationRepo =new conversationRepository()
const conversationMessageRepo =new conversationMessageRepository()

export const sendMessage = async ({content,file,receiverId,senderId})=>{
const user = await userRepo.findDocumentById(receiverId)
if(!user){
    throw new NotFoundException("Receiver not found")
}
return messageRepository.createDocument({content , file:file?.path , receiverId,senderId})
}
export const getMessageByReceiverId =async (receiverId)=>{

const messages = await messageRepository.findDocuments({ receiverId });
const requests = await requestsRepository.findDocuments({ receiverId });

const result = messages.map((message) => {
  const data = message.toObject();

  delete data.senderId;

  for (const request of requests) {
    if ( String(request.messageId) === String(message._id) && request.status === "accepted") {
        
      data.senderId = message.senderId;
      break;
    }
  }

  return data;
});

return result;;

}

export const askForSenderIdentity = async (messageId,receiverId)=>{
if(!messageId){
    throw new BadRequestException("messageId is missing")
}
const message = await messageRepository.findDocumentById(messageId)
if(!message){
        throw new NotFoundException("Invalid messageId")
}

const request = await requestsRepository.createDocument({messageId,receiverId, senderId: message.senderId})

}
export const getAllRequests = async (senderId)=>{

const requests = await requestsRepository.findDocuments({senderId})
return requests

}
export const changeRequestStatus = async ({requestId,status})=>{
   
    if(!requestId||!status){
    throw new BadRequestException("requestId and status are required")
}
const statusChange = await requestsRepository.findOneAndUpdateDocument({ _id: requestId }, { status },{ new: true ,runValidators: true });
if(!statusChange){
        throw new NotFoundException("Invalid requestId or status")
}
  if (status === "accepted") {
    let conversation = await conversationRepo.findOneDocument({messageId: statusChange.messageId,});
    
if(!conversation){
  conversation =  await conversationRepo.createDocument({participants:{
    senderId: statusChange.senderId,
    receiverId: statusChange.receiverId,
  },messageId:statusChange.messageId})
   return {message:"request accepted and conversation created successfully" ,conversation }
  }else{
     return {message:"you accepted this request before and conversation is already existed"}
  }


}else if(status =='rejected')
{
      return {message:"request rejected successfully"}
} else{
  return statusChange
}

}



const checkConversation = async (conversationId, userId) => {
  const conversation = await conversationRepo.findDocumentById(conversationId);

  if (!conversation) {
    throw new NotFoundException("Conversation not found");
  }

  const isParticipant =
    String(conversation.participants.senderId) === String(userId) ||
    String(conversation.participants.receiverId) === String(userId);

  if (!isParticipant) {
    throw new BadRequestException(
      "You are not allowed to access this conversation"
    );
  }

  return conversation;
};

export const sendConversationMessage = async ({conversationId, senderId,content,file}) => {
  if (!conversationId || !senderId || !content) {
    throw new BadRequestException(
      "conversationId, senderId, and content are required"
    );
  }

  await checkConversation(conversationId, senderId);

  return conversationMessageRepo.createDocument({
    conversationId,
    senderId,
    file:file?.path,
    content,
  });
};

export const getConversationMessages = async ({ conversationId, userId }) => {
  if (!conversationId || !userId) {
    throw new BadRequestException("conversationId and userId are required");
  }

  await checkConversation(conversationId, userId);

  return conversationMessageRepo.findDocuments({ conversationId });
};