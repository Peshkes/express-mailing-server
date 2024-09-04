const { validateTimestamps, validatePhoneNumber, validateClientType, validateClientExists, validateMessenger } = require("../validators/clientValidator");

async function validateClientData(req, res, next) {
    const { phone_number, name, type_id, check_in_date, check_out_date, messanger_id, chat_id } = req.body;

    if (!phone_number || !name || !type_id || !check_in_date || !check_out_date) {
        return res.status(400).json({ status: 'Missing required fields' });
    }

    if (!validatePhoneNumber(phone_number)) {
        return res.status(400).json({ status: 'Invalid phone number format' });
    }

    const dateValidation = validateTimestamps(check_in_date, check_out_date);
    if (!dateValidation.valid) {
        return res.status(400).json({ status: dateValidation.message });
    }

    try {
        const clientTypeValidation = await validateClientType(type_id);
        if (!clientTypeValidation.valid) {
            return res.status(400).json({ status: clientTypeValidation.message });
        }

        if (messanger_id) {
            const messangerValidation = await validateMessanger(messanger_id);
            if (!messangerValidation.valid) {
                return res.status(400).json({ status: messangerValidation.message });
            }
        }

        req.validatedData = {
            phone_number,
            name,
            type_id,
            check_in_date,
            check_out_date,
            messanger_id, chat_id
        };

        next();
    } catch (err) {
        return res.status(500).json({ status: 'Failed to validate client type', error: err.message });
    }
}

async function checkClientExists(req, res, next) {
    const { id } = req.params;
    try {
        const clientValidation = await validateClientExists(id);
        if (!clientValidation.valid) {
            return res.status(400).json({ status: clientValidation.message });
        }
        next();
    } catch (err) {
        return res.status(500).json({ status: 'Failed to validate client exists', error: err.message });
    }
}

async function checkMessengerExists(req, res, next) {
    const { messenger_id } = req.params;
    try {
        const messengerValidation = await validateMessenger(messenger_id);
        if (!messengerValidation.valid) {
            return res.status(400).json({ status: messengerValidation.message });
        }
        next();
    } catch (err) {
        return res.status(500).json({ status: 'Failed to validate messenger exists', error: err.message });
    }
}

module.exports = {
    validateClientData,
    checkClientExists,
    checkMessengerExists
};