const db = require("../api/db/dbConfig");
const { getMessageById } = require("./messageService");

/**
 * Отправляет сообщение немедленно (без сохранения в базе данных).
 * @param {string} message_text - Текст сообщения.
 * @param {number} recipient_type_id - ID типа получателя.
 * @param {string} media_path - Путь к медиа (может быть пустым).
 * @returns {Promise<Object>} - Объект с результатом отправки сообщения.
 */
async function sendMessageImmediately(message_text, recipient_type_id, media_path) {
    try {
        const users = getCl
        return {
            status: 'Message sent immediately'
        };
    } catch (err) {
        throw new Error(`Failed to send message immediately: ${err.message}`);
    }
}

/**
 * Отправляет отложенное сообщение немедленно.
 * @param {number} id - ID отложенного сообщения.
 * @returns {Promise<Object>} - Объект с результатом отправки сообщения.
 */
async function sendDelayedMessageNow(id) {
    try {
        const message = getMessageById(id)

        if (!message) {
            throw new Error('Message not found');
        }

        return sendMessageImmediately(message.message_text, message.recipient_type_id, message.media_path);
    } catch (err) {
        throw new Error(`Failed to send delayed message now: ${err.message}`);
    }
}

module.exports = {
    sendMessageImmediately,
    sendDelayedMessageNow,
};