import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
   participants: {
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},

 messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
      unique: true
    },

  });


const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;