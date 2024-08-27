const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/add_client', clientController.addClient);
router.get('/get_clients', clientController.getClients);

module.exports = router;