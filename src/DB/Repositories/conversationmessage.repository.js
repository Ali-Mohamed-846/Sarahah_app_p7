import Conversation from "../models/conversation.model.js";
import ConversationMessage from "../models/conversationmessages.model.js";
import BaseRepository from "./base.repository.js";

export default class conversationMessageRepository extends BaseRepository{
constructor(){
    super(ConversationMessage)
}
}
