const express = require('express');
const router = express.Router();
const {validateClientData, checkClientExists, checkMessengerExists} = require("../middlewares/clientMiddleware");
const {addClient, getClients, getClientById, deleteClient, updateClient, updateClientsMessenger, getClientsWithPaginationAndFilter, searchClients, getLastAddedClients, getClientsWithTelegramError, getClientsWithoutTypes, getClientsByTypeId} = require('../services/clientService');

router.post('/', validateClientData, async (req, res) => {
    const { phone_number, name, type_id, check_in_date, check_out_date, messanger_id, chat_id } = req.validatedData;
    try {
        const result = await addClient(phone_number, name, type_id, check_in_date, check_out_date, messanger_id, chat_id);
        res.status(201).json({ status: 'Client added successfully', id: result.id });
    } catch (err) {
        res.status(500).json({ status: 'Failed to add client', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const client = await getClientById(id);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ status: 'Client not found' });
        }
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve client', error: err.message });
    }
});

router.get('/:type_id', async (req, res) => {
    const { type_id } = req.params;
    try {
        const clients = await getClientsByTypeId(type_id);
        if (clients) {
            res.status(200).json(clients);
        } else {
            res.status(404).json({ status: 'Clients not found' });
        }
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients', error: err.message });
    }
});

router.put('/:id', checkClientExists, validateClientData, async (req, res) => {
    const { id } = req.params;
    const { phone_number, name, type_id, check_in_date, check_out_date, messanger_id } = req.validatedData;
    try {
        const result = await updateClient(id, phone_number, name, type_id, check_in_date, check_out_date, messanger_id);
        res.status(200).json({ status: 'Client updated successfully', id: result.id });
    } catch (err) {
        res.status(500).json({ status: 'Failed to update client', error: err.message });
    }
});

router.delete('/:id', checkClientExists, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteClient(id);
        res.status(200).json({ status: 'Client deleted successfully', client: result });
    } catch (err) {
        res.status(500).json({ status: 'Failed to delete client', error: err.message });
    }
});

router.put('/:id/:messanger_id', checkClientExists, checkMessengerExists, async (req, res) => {
    const { id, messanger_id } = req.params;
    try {
        const result = await updateClientsMessenger(id, messanger_id);
        res.status(200).json({ status: 'Client updated successfully', id: result.id });
    } catch (err) {
        res.status(500).json({ status: 'Failed to update client', error: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const clients = await getClients();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients', error: err.message });
    }
});

router.get('/all/paginated', async (req, res) => {
    const { page = 1, limit = 10, type } = req.query;
    try {
        const clients = await getClientsWithPaginationAndFilter({ page, limit, type });
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients', error: err.message });
    }
});

router.get('/all/search/:string', async (req, res) => {
    const { string } = req.params;
    const searchFields = req.query.fields ? req.query.fields.split(',') : [];
    try {
        const result = await searchClients(string, searchFields);
        res.status(200).json({ status: 'Client search completed', result: result });
    } catch (err) {
        res.status(500).json({ status: 'Failed to search client', error: err.message });
    }
});

router.get('/all/last/:count', async (req, res) => {
    const { count } = req.params;
    try {
        const clients = await getLastAddedClients(count);
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients', error: err.message });
    }
});

router.get('/all/telegram_error', async (req, res) => {
    try {
        const clients = await getClientsWithTelegramError();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients', error: err.message });
    }
});

router.get('/all/without_types', async (req, res) => {
    try {
        const clients = await getClientsWithoutTypes();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients', error: err.message });
    }
});

module.exports = router;