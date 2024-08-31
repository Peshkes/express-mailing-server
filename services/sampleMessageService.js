const db = require("../api/db/dbConfig");

/**
 * Добавляет новый шаблон рассылки.
 * @param {string} sample_name - Название шаблона.
 * @param {string} message_text - Текст сообщения.
 * @param {number} recipient_type_id - ID типа получателя.
 * @param {string} [media_path] - Путь к медиафайлу (опционально).
 * @param {number} sending_date - Дата отправки в формате long timestamp.
 * @returns {Promise<number>} - ID добавленной рассылки.
 * @throws {Error} - В случае ошибки при добавлении рассылки.
 */
async function addSample(sample_name, message_text, recipient_type_id, media_path, sending_date) {
    try {
        const [id] = await db('samples').insert({
            sample_name,
            message_text,
            recipient_type_id,
            media_path,
            sending_date,
        }).returning('id');
        return id;
    } catch (err) {
        throw new Error(`Failed to add sample: ${err.message}`);
    }
}

/**
 * Получает шаблон рассылки по ID.
 * @param {number} id - ID рассылки.
 * @returns {Promise<Object>} - Объект с данными рассылки.
 * @throws {Error} - В случае ошибки при получении рассылки.
 */
async function getSample(id) {
    try {
        return await db('samples').where('id', id).first();
    } catch (err) {
        throw new Error(`Failed to retrieve sample: ${err.message}`);
    }
}

/**
 * Получает все шаблоны рассылок.
 * @returns {Promise<Array>} - Массив объектов с данными рассылок.
 * @throws {Error} - В случае ошибки при получении рассылок.
 */
async function getSamples() {
    try {
        return await db('samples').select('*');
    } catch (err) {
        throw new Error(`Failed to retrieve samples: ${err.message}`);
    }
}

module.exports = {
    addSample,
    getSample,
    getSamples
}