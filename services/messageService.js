const db = require("../api/db/dbConfig");

/**
 * Добавляет сообщение в базу данных.
 * @param {string} theme - Тема сообщения.
 * @param {string} message_text - Текст сообщения.
 * @param {number | null} recipient_type_id - ID типа получателя.
 * @param {string} media_path - Новый путь к медиа.
 * @param {number} sending_date - Дата отправки в формате long timestamp.
 * @returns {Promise<Object>} - Объект с ID добавленного сообщения.
 */
async function addMessage(message_text, recipient_type_id = null, media_path, sending_date, theme) {
    try {
        const [result] = await db('messages')
            .insert({
                theme,
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
 * @param {string} theme - Тема сообщения.
 * @param {string} message_text - Новый текст сообщения.
 * @param {number | null} recipient_type_id - Новый ID типа получателя.
 * @param {string} media_path - Новый путь к медиа.
 * @param {number} sending_date - Новая дата отправки в формате long timestamp.
 * @returns {Promise<Object>} - Старое сообщение до изменения.
 */
async function updateMessage(id, message_text, recipient_type_id = null, media_path, sending_date, theme) {
    try {
        const oldMessage = await db('messages')
            .where({ id })
            .first();

        if (!oldMessage) {
            throw new Error(`Message with ID ${id} not found.`);
        }

        await db('messages')
            .where({ id })
            .update({
                theme,
                message_text,
                recipient_type_id,
                media_path,
                sending_date
            });

        return oldMessage;
    } catch (err) {
        throw new Error(`Failed to update message: ${err.message}`);
    }
}

/**
 * Удаляет сообщение по ID.
 * @param {number} id - ID сообщения.
 * @returns {Promise<Object>} - Удалённое сообщение или null, если сообщение не найдено.
 */
async function deleteMessage(id) {
    try {
        const deletedMessages = await db('messages')
            .where({ id })
            .del()
            .returning('*');

        if (deletedMessages.length === 0) {
            return null;
        }

        return deletedMessages[0];
    } catch (err) {
        throw new Error(`Failed to delete message: ${err.message}`);
    }
}

/**
 * Получает список сообщений с учетом пагинации и фильтрации по типу получателя.
 * @param {Object} options - Опции запроса.
 * @param {number} options.page - Номер страницы.
 * @param {number} options.limit - Количество сообщений на странице.
 * @param {string} [options.type] - Тип получателя для фильтрации (опционально).
 * @returns {Promise<Object>} - Объект с массивом сообщений и общим количеством страниц.
 */
async function getMessagesWithPaginationAndFilter({ page, limit, type }) {
    try {
        let query = db('messages');

        if (type) {
            query = query
                .join('client_types', 'messages.recipient_type_id', 'client_types.id')
                .where('client_types.type_name', type);
        }

        const offset = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            query.clone().select('*').limit(limit).offset(offset),
            query.clone().count('* as total').first()
        ]);

        const totalPages = Math.ceil(total.total / limit);

        return {
            data: messages,
            pagination: {
                total: total.total,
                page,
                totalPages,
                limit,
            },
        };
    } catch (err) {
        throw new Error(`Failed to retrieve messages: ${err.message}`);
    }
}

/**
 * Ищет сообщения по части текста и/или диапазону дат.
 * @param {string} [text] - Часть текста для поиска (опционально).
 * @param {number} [date_from] - Дата начала диапазона для поиска (опционально, в формате long timestamp).
 * @param {number} [date_to] - Дата окончания диапазона для поиска (опционально, в формате long timestamp).
 * @returns {Promise<Array>} - Массив сообщений, соответствующих запросу.
 * @throws {Error} - В случае ошибки при поиске сообщений.
 */
async function searchMessages(text, date_from, date_to) {
    try {
        let query = db('messages');

        if (text)
            query = query.where('message_text', 'like', `%${text}%`);

        if (date_from)
            query = query.where('sent_date', '>=', date_from);

        if (date_to)
            query = query.where('sent_date', '<=', date_to);

        return await query.select('*');
    } catch (err) {
        throw new Error(`Failed to search messages: ${err.message}`);
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

/**
 * Получает ближайшие N рассылок, которые будут отправлены в ближайшее время.
 * @param {number} count - Количество рассылок для получения.
 * @returns {Promise<Array>} - Массив ближайших рассылок.
 * @throws {Error} - В случае ошибки при получении рассылок.
 */
async function getUpcomingMailings(count) {
    try {
        const now = Date.now(); // Получаем текущее время в формате long timestamp

        return await db('messages')
            .where('sending_date', '>', now)
            .orderBy('sending_date', 'asc')
            .limit(count)
            .select('*');
    } catch (err) {
        throw new Error(`Failed to retrieve upcoming mailings: ${err.message}`);
    }
}

module.exports = {
    addMessage, getMessages, getMessageById, updateMessage, deleteMessage,
    searchMessages, getMessagesByRecipientType, getMessagesWithPaginationAndFilter,
    getUpcomingMailings
};