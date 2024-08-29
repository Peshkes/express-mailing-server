const db = require("../api/db/dbConfig");

/**
 * Добавляет сообщение в базу данных.
 * @param {string} message_text - Текст сообщения.
 * @param {number} recipient_type_id - ID типа получателя.
 * @param {string} media_path - Новый путь к медиа.
 * @param {number} sending_date - Дата отправки в формате long timestamp.
 * @returns {Promise<Object>} - Объект с ID добавленного сообщения.
 */
async function addMessage(message_text, recipient_type_id, media_path, sending_date) {
    try {
        const [result] = await db('messages')
            .insert({
                message_text,
                recipient_type_id,
                media_path,
                sending_date
            })
            .returning('id');
        return { id: result };
    } catch (err) {
        throw new Error(`Failed to add message: ${err.message}`);
    }
}

/**
 * Получает список всех сообщений.
 * @returns {Promise<Array>} - Массив сообщений.
 */
async function getMessages() {
    try {
        return await db('messages').select('*');
    } catch (err) {
        throw new Error(`Failed to retrieve messages: ${err.message}`);
    }
}

/**
 * Получает сообщение по ID.
 * @param {number} id - ID сообщения.
 * @returns {Promise<Object>} - Сообщение.
 */
async function getMessageById(id) {
    try {
        return await db('messages').where({ id }).first();
    } catch (err) {
        throw new Error(`Failed to retrieve message: ${err.message}`);
    }
}

/**
 * Обновляет сообщение по ID.
 * @param {number} id - ID сообщения.
 * @param {string} message_text - Новый текст сообщения.
 * @param {number} recipient_type_id - Новый ID типа получателя.
 * @param {string} media_path - Новый путь к медиа.
 * @param {number} sending_date - Новая дата отправки в формате long timestamp.
 * @returns {Promise<Object>} - Обновлённое сообщение.
 */
async function updateMessage(id, message_text, recipient_type_id, media_path, sending_date) {
    try {
        const [result] = await db('messages')
            .where({ id })
            .update({
                message_text,
                recipient_type_id,
                media_path,
                sending_date
            })
            .returning('*');
        return result;
    } catch (err) {
        throw new Error(`Failed to update message: ${err.message}`);
    }
}

/**
 * Удаляет сообщение по ID.
 * @param {number} id - ID сообщения.
 * @returns {Promise<Object>} - Удалённое сообщение.
 */
async function deleteMessage(id) {
    try {
        const [result] = await db('messages')
            .where({ id })
            .del()
            .returning('*');
        return result;
    } catch (err) {
        throw new Error(`Failed to delete message: ${err.message}`);
    }
}

/**
 * Ищет сообщения по части текста.
 * @param {string} text - Часть текста для поиска.
 * @returns {Promise<Array>} - Массив сообщений, соответствующих запросу.
 */
async function searchMessagesByText(text) {
    try {
        return await db('messages')
            .where('message_text', 'like', `%${text}%`)
            .select('*');
    } catch (err) {
        throw new Error(`Failed to search messages by text: ${err.message}`);
    }
}

/**
 * Получает сообщения по ID типа получателя.
 * @param {number} recipient_type_id - ID типа получателя.
 * @returns {Promise<Array>} - Массив сообщений для данного типа получателя.
 */
async function getMessagesByRecipientType(recipient_type_id) {
    try {
        return await db('messages')
            .where({ recipient_type_id })
            .select('*');
    } catch (err) {
        throw new Error(`Failed to retrieve messages by recipient type: ${err.message}`);
    }
}

module.exports = {
    addMessage,
    getMessages,
    getMessageById,
    updateMessage,
    deleteMessage,
    searchMessagesByText,
    getMessagesByRecipientType
};