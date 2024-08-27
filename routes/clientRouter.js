const express = require('express');
const router = express.Router();
const {validateClientData, checkClientExists} = require("../middlewares/clientMiddleware");
const {addClient, getClients, getClientById, deleteClient, updateClient} = require('../services/clientService');

router.get('/clients', async (req, res) => {
    try {
        const clients = await getClients();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients', error: err.message });
    }
});

router.get('/client/:id', async (req, res) => {
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

router.post('/client', validateClientData, async (req, res) => {
    const { phone_number, name, type_id, check_in_date, check_out_date } = req.validatedData;
    try {
        const result = await addClient(phone_number, name, type_id, check_in_date, check_out_date);
        res.status(201).json({ status: 'Client added successfully', id: result.id });
    } catch (err) {
        res.status(500).json({ status: 'Failed to add client', error: err.message });
    }
});

router.put('/client/:id', checkClientExists, validateClientData, async (req, res) => {
    const { id } = req.params;
    const { phone_number, name, type_id, check_in_date, check_out_date } = req.validatedData;
    try {
        const result = await updateClient(id, phone_number, name, type_id, check_in_date, check_out_date);
        res.status(200).json({ status: 'Client updated successfully', id: result.id });
    } catch (err) {
        res.status(500).json({ status: 'Failed to update client', error: err.message });
    }
});

router.delete('/client/:id', checkClientExists, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteClient(id);
        res.status(200).json({ status: 'Client deleted successfully', client: result });
    } catch (err) {
        res.status(500).json({ status: 'Failed to delete client', error: err.message });
    }
});

module.exports = router;