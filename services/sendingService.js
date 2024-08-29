const db = require("../api/db/dbConfig");

/**
 * Отправляет сообщение немедленно (без сохранения в базе данных).
 * @param {string} message_text - Текст сообщения.
 * @param {number} recipient_type_id - ID типа получателя.
 * @param {string} media_path - Путь к медиа (может быть пустым).
 * @param {number} sending_date - Дата отправки в формате long timestamp.
 * @returns {Promise<Object>} - Объект с результатом отправки сообщения.
 */
async function sendMessageImmediately(message_text, recipient_type_id, media_path, sending_date) {
    // Здесь должна быть логика отправки сообщения немедленно
    // Например, отправка в очередь или напрямую в другой сервис
    try {
        // Пример для отладки
        return {
            message_text,
            recipient_type_id,
            video_path,
            image_path,
            sending_date,
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
        // Получаем сообщение из базы данных
        const message = await db('messages').where({ id }).first();

        if (!message) {
            throw new Error('Message not found');
        }

        // Отправляем сообщение немедленно (логика отправки)
        // Например, отправка в очередь или напрямую в другой сервис

        return {
            ...message,
            status: 'Message sent immediately'
        };
    } catch (err) {
        throw new Error(`Failed to send delayed message now: ${err.message}`);
    }
}

module.exports = {
    sendMessageImmediately,
    sendDelayedMessageNow,
};