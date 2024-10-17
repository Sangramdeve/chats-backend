const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const conversationSchema = new mongoose.Schema({
  members: {
    type: [String],
    required: true,
  },
  messages: [messageSchema],
});

module.exports = mongoose.model("Conversation", conversationSchema);
