const db = require("../api/db/dbConfig");

async function getRecipientTypes() {
    try {
        return db('client_types').select('*');
    } catch (err) {
        throw new Error(`Failed to retrieve client types: ${err.message}`);
    }
}

async function getMessengerTypes() {
    try {
        return db('messengers').select('*');
    } catch (err) {
        throw new Error(`Failed to retrieve client types: ${err.message}`);
    }
}

module.exports = { getRecipientTypes, getMessengerTypes }