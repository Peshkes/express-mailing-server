const express = require('express');
const {getRecipientTypes, getMessengerTypes} = require("../services/utilityService");
const router = express.Router();

router.get('/recipient-types', async (req, res) => {
    try {
        const types = await getRecipientTypes();
        if (types) {
            res.status(200).json(types);
        } else {
            res.status(404).json({status: 'Types not found'});
        }
    } catch (err) {
        res.status(500).json({status: 'Failed to add client', error: err.message});
    }
});

router.get('/messenger-types', async (req, res) => {
    try {
        const types = await getMessengerTypes();
        if (types) {
            res.status(200).json(types);
        } else {
            res.status(404).json({status: 'Types not found'});
        }
    } catch (err) {
        res.status(500).json({status: 'Failed to add client', error: err.message});
    }
});

module.exports = router;