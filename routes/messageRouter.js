const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/message', messageController.addMessage);
router.get('/messages', messageController.getMessages);
router.get('/message/:id', messageController.getMessageById);

module.exports = router;