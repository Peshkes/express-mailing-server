const db = require("../api/db/dbConfig");

/**
 * Добавляет новый шаблон рассылки.
 * @param {string} sample_name - Название шаблона.
 * @param {string} theme - Тема сообщения.
 * @param {string} message_text - Текст сообщения.
 * @param {number | null} recipient_type_id - ID типа получателя.
 * @param {string} [media_path] - Путь к медиафайлу (опционально).
 * @param {number} sending_date - Дата отправки в формате long timestamp.
 * @returns {Promise<number>} - ID добавленной рассылки.
 * @throws {Error} - В случае ошибки при добавлении рассылки.
 */
async function addSample(sample_name, message_text, recipient_type_id = null, media_path, sending_date, theme) {
    try {
        const [id] = await db('samples').insert({
            sample_name,
            theme,
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
        const samples = await db('samples').select('*');
        return samples.length ? samples : null; // Возвращаем пустой массив, если шаблонов нет
    } catch (err) {
        throw new Error(`Failed to retrieve samples: ${err.message}`);
    }
}

/**
 * Удаляет шаблон рассылки по ID и возвращает объект до его удаления.
 * @param {number} id - ID рассылки, которую нужно удалить.
 * @returns {Promise<Object>} - Объект до удаления.
 * @throws {Error} - В случае ошибки при удалении рассылки.
 */
async function deleteSample(id) {
    try {
        const existingSample = await db('samples')
            .where('id', id)
            .first();

        if (!existingSample) {
            throw new Error(`Sample with ID ${id} not found.`);
        }

        await db('samples')
            .where('id', id)
            .del();

        return existingSample;
    } catch (err) {
        throw new Error(`Failed to delete sample: ${err.message}`);
    }
}

/**
 * Обновляет данные шаблона рассылки по ID и возвращает объект до его обновления.
 * @param {number} id - ID рассылки, которую нужно обновить.
 * @param {Object} updateData - Объект с обновляемыми данными.
 * @param {string} [updateData.sample_name] - Новое название шаблона.
 * @param {string} [updateData.theme] - Новая тема сообщения.
 * @param {string} [updateData.message_text] - Новый текст сообщения.
 * @param {number | null} [updateData.recipient_type_id] - Новый ID типа получателя.
 * @param {string} [updateData.media_path] - Новый путь к медиафайлу.
 * @param {number} [updateData.sending_date] - Новая дата отправки в формате long timestamp.
 * @returns {Promise<Object>} - Объект до обновления.
 * @throws {Error} - В случае ошибки при обновлении рассылки.
 */
async function updateSample(id, updateData) {
    try {
        const existingSample = await db('samples')
            .where('id', id)
            .first();

        if (!existingSample) {
            throw new Error(`Sample with ID ${id} not found.`);
        }

        await db('samples')
            .where('id', id)
            .update(updateData);

        return existingSample;
    } catch (err) {
        throw new Error(`Failed to update sample: ${err.message}`);
    }
}

module.exports = {
    addSample, updateSample,
    getSample, deleteSample,
    getSamples
}