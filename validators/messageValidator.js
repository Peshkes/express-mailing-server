const db = require("../api/db/dbConfig");

/**
 * Проверяет корректность текста сообщения.
 * @param {string} message_text - Текст сообщения.
 * @returns {boolean} - Корректность текста.
 */
function validateMessageText(message_text) {
    return typeof message_text === 'string' && message_text.trim().length > 0;
}

/**
 * Проверяет корректность ID типа получателя.
 * @param {number} recipient_type_id - ID типа получателя.
 * @returns {boolean} - Корректность ID типа получателя.
 */
function validateRecipientTypeId(recipient_type_id) {
    return Number.isInteger(recipient_type_id) && recipient_type_id > 0;
}

/**
 * Проверяет корректность ссылки на видео.
 * @param {string} video_path - Ссылка на видео.
 * @returns {boolean} - Корректность ссылки.
 */
function validateVideoPath(video_path) {
    return video_path === undefined || (typeof video_path === 'string' && video_path.trim().length > 0);
}

/**
 * Проверяет корректность ссылки на изображение.
 * @param {string} image_path - Ссылка на изображение.
 * @returns {boolean} - Корректность ссылки.
 */
function validateImagePath(image_path) {
    return image_path === undefined || (typeof image_path === 'string' && image_path.trim().length > 0);
}

/**
 * Проверяет корректность отправляемой даты.
 * @param {number} sending_date - Дата отправки в формате long timestamp.
 * @returns {boolean} - Корректность даты.
 */
function validateSendingDate(sending_date) {
    return Number.isInteger(sending_date) && sending_date > 0;
}

/**
 * Проверяет корректность отправляемой даты.
 * @param {number} messageId - ID рассылки.
 * @returns {Promise<Object>} - Результат проверки. Включает флаг `valid` и сообщение об ошибке при необходимости.
 */
async function validateMessageExists(messageId) {
    const message = await db('messages').where({ id: messageId }).first();
    return message ? { valid: true } : { valid: false, message: 'Message not found' };
}

module.exports = {
    validateSendingDate,
    validateMessageText,
    validateRecipientTypeId,
    validateVideoPath,
    validateImagePath,
    validateMessageExists
};