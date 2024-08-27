async function addClient(req, res) {
    const { phone_number, name, type_id, check_in_date, check_out_date } = req.body;
    try {
        // const result = await clientModel.addClient(phone_number, name, type_id, check_in_date, check_out_date);
        res.status(201).json({ status: 'Client added successfully', id: result.id });
    } catch (err) {
        res.status(500).json({ status: 'Failed to add client', error: err.message });
    }
}

async function getClients(req, res) {
    try {
        // const clients = await clientModel.getClients();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ status: 'Failed to retrieve clients', error: err.message });
    }
}

module.exports = {
    addClient,
    getClients,
};