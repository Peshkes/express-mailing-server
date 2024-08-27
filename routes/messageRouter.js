const express = require('express');
const router = express.Router();
const {validateMessageData, checkMessageExists} = require("../middlewares/messageMiddleware");

const {addMessage, getMessages, getMessageById, updateMessage, deleteMessage, searchMessagesByText, getMessagesByRecipientType} = require('../services/messageService');
const {sendDelayedMessageNow, sendMessageImmediately} = require('../services/sendingService');

router.post('/', validateMessageData, async (req, res) => {
    const {message_text, recipient_type_id, video_path, image_path, sending_date} = req.validatedData;
    try {
        const result = await addMessage(message_text, recipient_type_id, video_path, image_path, sending_date);
        res.status(201).json({status: 'Message added successfully', id: result.id});
    } catch (err) {
        res.status(500).json({status: 'Failed to add message', error: err.message});
    }
});

router.get('/:id', async (req, res) => {
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

router.put('/:id', checkMessageExists, validateMessageData, async (req, res) => {
    const {id} = req.params;
    const {message_text, recipient_type_id, video_path, image_path, sending_date} = req.validatedData;
    try {
        const message = await updateMessage(id, message_text, recipient_type_id, video_path, image_path, sending_date);
        res.status(200).json({status: 'Message updated successfully', message});
    } catch (err) {
        res.status(500).json({status: 'Failed to update message', error: err.message});
    }
});

router.delete('/:id', checkMessageExists, async (req, res) => {
    const {id} = req.params;
    try {
        const message = await deleteMessage(id);
        res.status(200).json({status: 'Message deleted successfully', message});
    } catch (err) {
        res.status(500).json({status: 'Failed to delete message', error: err.message});
    }
});

router.post('/:id/send-now', checkMessageExists, async (req, res) => {
    const {id} = req.params;
    try {
        const result = await sendDelayedMessageNow(id);
        res.status(200).json({status: 'Message sent immediately', result});
    } catch (err) {
        res.status(500).json({status: 'Failed to send message immediately', error: err.message});
    }
});

router.get('/all', async (req, res) => {
    try {
        const messages = await getMessages();
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({status: 'Failed to retrieve messages', error: err.message});
    }
});

router.get('/all/search', async (req, res) => {
    const { text } = req.query;
    try {
        const messages = await searchMessagesByText(text);
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({status: 'Failed to search messages', error: err.message});
    }
});

router.post('/send-now', validateMessageData, async (req, res) => {
    const {message_text, recipient_type_id, video_path, image_path, sending_date} = req.validatedData;
    try {
        const result = await sendMessageImmediately(message_text, recipient_type_id, video_path, image_path, sending_date);
        res.status(200).json({status: 'Message sent immediately', result});
    } catch (err) {
        res.status(500).json({status: 'Failed to send message immediately', error: err.message});
    }
});

router.get('/all/recipient-type/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const messages = await getMessagesByRecipientType(id);
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({status: 'Failed to retrieve messages', error: err.message});
    }
});

module.exports = router;