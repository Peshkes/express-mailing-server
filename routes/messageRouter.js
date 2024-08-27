const express = require('express');
const router = express.Router();
const {validateMessageData, checkMessageExists} = require("../middlewares/messageMiddleware");
const {addMessage, getMessages, getMessageById, updateMessage, deleteMessage} = require('../services/messageService');

router.post('/message', validateMessageData, async (req, res) => {
    const {message_text, recipient_type_id, video_path, image_path, sending_date} = req.validatedData;
    try {
        const result = await addMessage(message_text, recipient_type_id, video_path, image_path, sending_date);
        res.status(201).json({status: 'Message added successfully', id: result.id});
    } catch (err) {
        res.status(500).json({status: 'Failed to add message', error: err.message});
    }
});

router.get('/messages', async (req, res) => {
    try {
        const messages = await getMessages();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({status: 'Failed to retrieve messages', error: err.message});
    }
});

router.get('/message/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const message = await getMessageById(id);
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json({status: 'Message not found'});
        }
    } catch (err) {
        res.status(500).json({status: 'Failed to retrieve message', error: err.message});
    }
});

router.put('/message/:id', checkMessageExists, validateMessageData, async (req, res) => {
    const {id} = req.params;
    const {message_text, recipient_type_id, video_path, image_path, sending_date} = req.validatedData;
    try {
        const message = await updateMessage(id, message_text, recipient_type_id, video_path, image_path, sending_date);
        res.status(200).json({status: 'Message updated successfully', message});
    } catch (err) {
        res.status(500).json({status: 'Failed to update message', error: err.message});
    }
});

router.delete('/message/:id', checkMessageExists, async (req, res) => {
    const {id} = req.params;
    try {
        const message = await deleteMessage(id);
        res.status(200).json({status: 'Message deleted successfully', message});
    } catch (err) {
        res.status(500).json({status: 'Failed to delete message', error: err.message});
    }
});

module.exports = router;