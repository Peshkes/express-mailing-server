const db = require('../api/db/dbConfig');

function validatePhoneNumber(phone_number) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone_number);
}

function validateTimestamps(check_in_timestamp, check_out_timestamp) {
    if (typeof check_in_timestamp !== 'number' || typeof check_out_timestamp !== 'number') {
        return { valid: false, message: 'Timestamps must be numeric' };
    }

    if (check_out_timestamp <= check_in_timestamp) {
        return { valid: false, message: 'Check-out timestamp must be after check-in timestamp' };
    }

    return { valid: true };
}

async function validateClientType(type_id) {
    const clientType = await db('client_types').where({ id: type_id }).first();
    return clientType ? { valid: true } : { valid: false, message: 'Invalid client type' };
}

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