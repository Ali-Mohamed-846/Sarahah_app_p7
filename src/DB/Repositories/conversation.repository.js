import Conversation from "../models/conversation.model.js";
import BaseRepository from "./base.repository.js";

export default class conversationRepository extends BaseRepository{
constructor(){
    super(Conversation)
}
}
