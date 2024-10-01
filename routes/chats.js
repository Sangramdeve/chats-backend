const express = require('express');
const { createConversation,getSingleConversion,deleteConversation,getAllConversations } = require('../controllers/conversation');

const router = express.Router();

// Sends a new message / Adds a new message
router.route('/messages').get((req, res) => {
  res.status(200).send("GET messages not implemented yet");
}).post((req, res) => {
  res.status(200).send("POST messages not implemented yet");
});

// Marks a message as read
router.route('/messages/mark-read').get((req, res) => {
  res.status(200).send("GET mark-read not implemented yet");
}).post((req, res) => {
  res.status(200).send("POST mark-read not implemented yet");
});

// Retrieves all conversations for a specific user to show recent chats
router.route('/conversations/all/:userId').get(getAllConversations);

// Creates a new conversation 
router.route('/conversations').post(createConversation);

// Gets details of a specific conversation
router.route('/conversations/:id').get(getSingleConversion).delete(deleteConversation);

module.exports = router;
