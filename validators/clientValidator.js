const db = require('../api/db/dbConfig');

/**
 * Проверяет корректность номера телефона.
 * @param {string} phone_number - Номер телефона.
 * @returns {boolean} - Корректность номера телефона.
 */
function validatePhoneNumber(phone_number) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone_number);
}

/**
 * Проверяет корректность временных меток заезда и выезда.
 * @param {number} check_in_timestamp - Временная метка заезда в формате long timestamp.
 * @param {number} check_out_timestamp - Временная метка выезда в формате long timestamp.
 * @returns {Object} - Результат проверки. Включает флаг `valid` и сообщение об ошибке при необходимости.
 */
function validateTimestamps(check_in_timestamp, check_out_timestamp) {
    if (typeof check_in_timestamp !== 'number' || typeof check_out_timestamp !== 'number') {
        return { valid: false, message: 'Timestamps must be numeric' };
    }

    if (check_out_timestamp <= check_in_timestamp) {
        return { valid: false, message: 'Check-out timestamp must be after check-in timestamp' };
    }

    return { valid: true };
}

/**
 * Проверяет существование типа клиента по его ID.
 * @param {number} type_id - ID типа клиента.
 * @returns {Promise<Object>} - Результат проверки. Включает флаг `valid` и сообщение об ошибке при необходимости.
 */
async function validateClientType(type_id) {
    const clientType = await db('client_types').where({ id: type_id }).first();
    return clientType ? { valid: true } : { valid: false, message: 'Invalid client type' };
}

/**
 * Проверяет существование клиента по его ID.
 * @param {number} clientId - ID клиента.
 * @returns {Promise<Object>} - Результат проверки. Включает флаг `valid` и сообщение об ошибке при необходимости.
 */
async function validateClientExists(clientId) {
    const client = await db('clients').where({ id: clientId }).first();
    return client ? { valid: true } : { valid: false, message: 'Client not found' };
}

module.exports = {
    validatePhoneNumber,
    validateTimestamps,
    validateClientType,
    validateClientExists
};