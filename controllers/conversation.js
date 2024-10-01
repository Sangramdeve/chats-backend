const Conversation = require("../models/conversations");

async function createConversation(req, res) {
  const body = req.body;
  if (!body || !body.members) {
    return res.status(400).json({ msg: "members uid are required" });
  }

  try {
    // Check if a conversation already exists between the members
    const existingConversation = await Conversation.findOne({
      members: { $all: body.members }, // $all checks if the conversation includes all provided members
    });

    if (existingConversation) {
      return res.status(400).json({
        msg: "Conversation already exists between these members",
        conversation: existingConversation,
      });
    }

    // If no conversation exists, create a new one
    const newConversation = await Conversation.create({
      members: body.members,
      messages: body.messages || [],
    });

    return res.status(201).json({
      msg: "Conversation created successfully",
      conversation: newConversation,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

async function getSingleConversion(req, res) {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    return res.json({ conversation });
  } catch (error) {
    console.log("Error finding conversation:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

async function deleteConversation(req, res) {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }
    return res.json({ msg: "Conversation deleted successfully" });
  } catch (error) {
    console.log("Error deleting conversation:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

async function getAllConversations(req, res) {
  try {
    const { userId } = req.params;

    // Find all conversations where the userId is present in the members array
    const conversations = await Conversation.find({
      members: { $in: [userId] }
    });

    if (conversations.length === 0) {
      return res.status(404).json({ msg: "No conversations found for this user" });
    }

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

  
  
module.exports = {
  createConversation,
  getSingleConversion,
  deleteConversation,
  getAllConversations,
};
