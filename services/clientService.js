const db = require("../api/db/dbConfig");

/**
 * Добавляет клиента в базу данных.
 * @param {string} phone_number - Номер телефона клиента.
 * @param {string} name - Имя клиента.
 * @param {number} type_id - ID типа клиента.
 * @param {number} check_in_date - Дата заезда в формате long timestamp.
 * @param {number} check_out_date - Дата выезда в формате long timestamp.
 * @param {number} messenger_id - ID мессенджера.
 * @returns {Promise<Object>} - Объект с ID добавленного клиента.
 */
async function addClient(phone_number, name, type_id, check_in_date, check_out_date, messenger_id) {
    try {
        const [result] = await db('clients')
            .insert({
                phone_number,
                name,
                type_id,
                messenger_id,
                check_in_date,
                check_out_date
            })
            .returning('id');

        return {id: result};
    } catch (err) {
        throw new Error(`Failed to add client: ${err.message}`);
    }
}

/**
 * Получает список всех клиентов из базы данных.
 * @returns {Promise<Array>} - Массив клиентов.
 */
async function getClients() {
    try {
        return await db('clients').select('*');
    } catch (err) {
        throw new Error(`Failed to retrieve clients: ${err.message}`);
    }
}

/**
 * Получает клиента по ID из базы данных.
 * @param {number} clientId - ID клиента.
 * @returns {Promise<Object>} - Объект клиента.
 */
async function getClientById(clientId) {
    try {
        const client = await db('clients').where({id: clientId}).first();
        if (!client) {
            throw new Error('Client not found');
        }
        return client;
    } catch (err) {
        throw new Error(`Failed to retrieve client: ${err.message}`);
    }
}

/**
 * Обновляет информацию о клиенте в базе данных.
 * @param {number} id - ID клиента.
 * @param {string} phone_number - Номер телефона клиента.
 * @param {string} name - Имя клиента.
 * @param {number} type_id - ID типа клиента.
 * @param {number} check_in_date - Дата заезда в формате long timestamp.
 * @param {number} check_out_date - Дата выезда в формате long timestamp.
 * @param {number} messanger_id - ID мессенджера.
 * @returns {Promise<Object>} - Объект с ID обновленного клиента.
 */
async function updateClient(id, phone_number, name, type_id, check_in_date, check_out_date, messanger_id) {
    try {
        const [result] = await db('clients')
            .where({id})
            .update({
                phone_number,
                name,
                type_id,
                messanger_id,
                check_in_date,
                check_out_date
            })
            .returning('id');

        if (!result) {
            throw new Error('Client not found');
        }

        return {id: result};
    } catch (err) {
        throw new Error(`Failed to update client: ${err.message}`);
    }
}

/**
 * Обновляет ID мессенджера у клиента в базе данных.
 * @param {number} id - ID клиента.
 * @param {number} messenger_id - ID мессенджера.
 * @returns {Promise<Object>} - Объект с ID обновленного клиента.
 */
async function updateClientsMessenger(id, messenger_id) {
    try {
        const [result] = await db('clients')
            .where({id})
            .update({
                messenger_id
            })
            .returning('id');
        if (!result) {
            throw new Error('Client not found');
        }
        return {id: result};
    } catch (err) {
        throw new Error(`Failed to update client: ${err.message}`);
    }
}

/**
 * Удаляет клиента из базы данных.
 * @param {number} id - ID клиента.
 * @returns {Promise<Object>} - Объект удаленного клиента.
 */
async function deleteClient(id) {
    try {
        const client = await db('clients')
            .where({id})
            .first();

        if (!client) {
            throw new Error('Client not found');
        }

        await db('clients')
            .where({id})
            .del();

        return client;
    } catch (err) {
        throw new Error(`Failed to delete client: ${err.message}`);
    }
}

/**
 * Получает список клиентов с учетом пагинации и фильтрации по типу клиента.
 * @param {Object} options - Опции запроса.
 * @param {number} options.page - Номер страницы.
 * @param {number} options.limit - Количество клиентов на странице.
 * @param {string} [options.type] - Тип клиента для фильтрации (опционально).
 * @returns {Promise<Object>} - Объект с массивом клиентов и общим количеством страниц.
 */
async function getClientsWithPaginationAndFilter({page, limit, type}) {
    try {
        let query = db('clients');

        if (type) {
            query = query.where('type', type);
        }

        const offset = (page - 1) * limit;

        const [clients, total] = await Promise.all([
            query.clone().select('*').limit(limit).offset(offset),
            query.clone().count('* as total').first()
        ]);

        const totalPages = Math.ceil(total.total / limit);

        return {
            data: clients,
            pagination: {
                total: total.total,
                page,
                totalPages,
                limit,
            },
        };
    } catch (err) {
        throw new Error(`Failed to retrieve clients: ${err.message}`);
    }
}

async function searchClients(string, searchFields) {
    try {
        let query = db('clients');

        if (searchFields.includes('phone') && searchFields.includes('name')) {
            query = query.where(function () {
                this.where('phone_number', 'like', `%${string}%`)
                    .orWhere('name', 'like', `%${string}%`);
            });
        } else if (searchFields.includes('phone')) {
            query = query.where('phone_number', 'like', `%${string}%`);
        } else if (searchFields.includes('name')) {
            query = query.where('name', 'like', `%${string}%`);
        } else {
            throw new Error('Некорректные поля поиска');
        }

        return await query.select('*');
    } catch (error) {
        console.error('Ошибка при поиске клиентов:', error);
        throw error;
    }
}

module.exports = {
    addClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
    updateClientsMessenger,
    getClientsWithPaginationAndFilter,
    searchClients
};