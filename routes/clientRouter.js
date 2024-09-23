const express = require('express');
const router = express.Router();
const {validateClientData, checkClientExists, checkMessengerExists} = require("../middlewares/clientMiddleware");
const {addClient, getClients, getClientById, deleteClient, updateClient, updateClientsMessenger,
    getClientsWithPaginationAndFilter, searchClients, getLastAddedClients, getClientsWithTelegramError, getClientsWithoutTypes,
    getClientsByTypeId, getFilteredClients} = require('../services/clientService');

// Добавление клиента
router.post('/', validateClientData, async (req, res) => {
    const { phone_number, name, type_id, check_in_date, check_out_date, messanger_id, chat_id } = req.validatedData;
    try {
        const result = await addClient(phone_number, name, type_id, check_in_date, check_out_date, messanger_id, chat_id);
        res.status(201).json(result.id);
    } catch (err) {
        res.status(500).json({ status: 'Failed to add client: ' + err.message });
    }
});

// Получение клиента по ID
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
        res.status(500).json({ status: 'Failed to retrieve client: ' + err.message });
    }
});

// Обновление клиента по ID
router.put('/:id', checkClientExists, validateClientData, async (req, res) => {
    const { id } = req.params;
    const { phone_number, name, type_id, check_in_date, check_out_date, messanger_id } = req.validatedData;
    try {
        const result = await updateClient(id, phone_number, name, type_id, check_in_date, check_out_date, messanger_id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: 'Failed to update client: ' + err.message });
    }
});

// Удаление клиента по ID
router.delete('/:id', checkClientExists, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteClient(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: 'Failed to delete client: ' + err.message });
    }
});

// Обновление мессенджера клиента
router.put('/:id/:messanger_id', checkClientExists, checkMessengerExists, async (req, res) => {
    const { id, messanger_id } = req.params;
    try {
        await updateClientsMessenger(id, messanger_id);
        res.status(200).json({ status: 'Messenger updated' });
    } catch (err) {
        res.status(500).json({ status: 'Failed to update client: ' + err.message });
    }
});

// Получение всех клиентов
router.get('/all', async (req, res) => {
    try {
        const clients = await getClients();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients: ' + err.message });
    }
});

// Пагинированное получение клиентов
router.get('/all/paginated', async (req, res) => {
    const { page = 1, limit = 10, type } = req.query;
    try {
        const clients = await getClientsWithPaginationAndFilter({ page, limit, type });
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients: ' + err.message });
    }
});

// Поиск клиентов
router.get('/all/search/:string', async (req, res) => {
    const { string } = req.params;
    const searchFields = req.query.fields ? req.query.fields.split(',') : [];
    try {
        const result = await searchClients(string, searchFields);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: 'Failed to search client: ' + err.message });
    }
});

// Получение последних добавленных клиентов
router.get('/all/last/:count', async (req, res) => {
    const { count } = req.params;
    try {
        const clients = await getLastAddedClients(count);
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients: ' + err.message });
    }
});

// Получение клиентов с ошибкой Telegram
router.get('/all/telegram_error', async (req, res) => {
    try {
        const clients = await getClientsWithTelegramError();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients: ' + err.message });
    }
});

// Получение клиентов без типа
router.get('/all/without_types', async (req, res) => {
    try {
        const clients = await getClientsWithoutTypes();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients: ' + err.message });
    }
});

// Фильтрация клиентов
router.get('/all/full_filtered', async (req, res) => {
    const { page = 1, limit = 10, type_id, search_type, search_string, tg_error } = req.query;
    try {
        const clients = await getFilteredClients({ page, limit, type_id, search_type, search_string, tg_error });
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients: ' + err.message });
    }
});

// Получение клиентов по типу
router.get('/type/:type_id', async (req, res) => {
    const { type_id } = req.params;
    try {
        const clients = await getClientsByTypeId(type_id);
        if (clients.length > 0) {
            res.status(200).json(clients);
        } else {
            res.status(404).json({ status: 'Clients not found' });
        }
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients: ' + err.message });
    }
});

module.exports = router;