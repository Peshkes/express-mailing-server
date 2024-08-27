const {validateSendingDate, validateMessageText, validateRecipientTypeId, validateVideoPath, validateImagePath, validateMessageExists} = require('../validators/messageValidator');

function validateMessageData(req, res, next) {
    const {message_text, recipient_type_id, video_path, image_path, sending_date} = req.body;

    const isMessageTextValid = validateMessageText(message_text);
    if (!isMessageTextValid) {
        return res.status(400).json({status: 'Invalid message text'});
    }

    const isRecipientTypeIdValid = validateRecipientTypeId(recipient_type_id);
    if (!isRecipientTypeIdValid) {
        return res.status(400).json({status: 'Invalid recipient type ID'});
    }

    const isVideoPathValid = validateVideoPath(video_path);
    if (!isVideoPathValid) {
        return res.status(400).json({status: 'Invalid video path'});
    }

    const isImagePathValid = validateImagePath(image_path);
    if (!isImagePathValid) {
        return res.status(400).json({status: 'Invalid image path'});
    }

    const isSendingDateValid = validateSendingDate(sending_date);
    if (!isSendingDateValid) {
        return res.status(400).json({status: 'Invalid sending date'});
    }

    req.validatedMessageData = {message_text, recipient_type_id, video_path, image_path, sending_date};
    next();
}

async function checkMessageExists(req, res, next) {
    const { id } = req.params;
    try {
        const messageValidation = await validateMessageExists(id);
        if (!messageValidation.valid) {
            return res.status(400).json({ status: messageValidation.message });
        }
        next();
    } catch (err) {
        return res.status(500).json({ status: 'Failed to validate message exists', error: err.message });
    }
}

module.exports = {
    validateMessageData,
    checkMessageExists
};