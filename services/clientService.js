const db = require("../api/db/dbConfig");

/**
 * Добавляет клиента в базу данных.
 * @param {string} phone_number - Номер телефона клиента.
 * @param {string} name - Имя клиента.
 * @param {number} type_id - ID типа клиента.
 * @param {number} check_in_date - Дата заезда в формате long timestamp.
 * @param {number} check_out_date - Дата выезда в формате long timestamp.
 * @param {number} messenger_id - ID мессенджера.
 * @param {number | null} [chat_id] - ID чата в мессенджере.
 * @returns {Promise<Object>} - Объект с ID добавленного клиента.
 */
async function addClient(phone_number, name, type_id, check_in_date, check_out_date, messenger_id, chat_id = null) {
    try {
        const [result] = await db('clients')
            .insert({
                phone_number,
                name,
                type_id,
                messenger_id,
                check_in_date,
                check_out_date,
                chat_id
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
 * @throws {Error} - В случае ошибки при получении данных.
 */
async function getClients() {
    try {
        const clients = await db('clients').select('*');
        return clients.length ? clients : [];
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
 * Получает клиентов по ID типа из базы данных.
 * @param {number} typeId - ID типа.
 * @returns {Promise<Array>} - Массив клиентов.
 * @throws {Error} - В случае ошибки при получении данных.
 */
async function getClientsByTypeId(typeId) {
    try {
        const clients = await db('clients').where({type_id: typeId});
        return clients.length ? clients : [];
    } catch (err) {
        throw new Error(`Failed to retrieve clients: ${err.message}`);
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
        const oldClient = await db('clients').where({id}).first();
        if (!oldClient) {
            throw new Error('Client not found');
        }

        const [updatedId] = await db('clients')
            .where({id})
            .update({messenger_id})
            .returning('id');

        if (!updatedId) {
            throw new Error('Failed to update client');
        }

        return oldClient;
    } catch (err) {
        throw new Error(`Failed to update client: ${err.message}`);
    }
}

/**
 * Обновляет ID мессенджера у клиента в базе данных.
 * @param {number} id - ID клиента.
 * @param {number} type_id - ID типа.
 * @returns {Promise<Object>} - Объект с ID обновленного клиента.
 */
async function updateClientsType(id, type_id) {
    try {
        const oldClient = await db('clients').where({id}).first();
        if (!oldClient) {
            throw new Error('Client not found');
        }

        const [updatedId] = await db('clients')
            .where({id})
            .update({type_id})
            .returning('id');

        if (!updatedId) {
            throw new Error('Failed to update client');
        }

        return oldClient;
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
 * @param {number} [options.typeId] - Тип клиента для фильтрации (опционально).
 * @returns {Promise<Object>} - Объект с массивом клиентов и общим количеством страниц.
 */
async function getClientsWithPaginationAndFilter({page, limit, typeId}) {
    try {
        let query = db('clients');

        if (typeId) {
            query = query.where('type_id', typeId);
        }

        const offset = (page - 1) * limit;

        const [clients, total] = await Promise.all([
            query.clone().select('*').limit(limit).offset(offset),
            query.clone().count('* as total').first()
        ]);

        const totalPages = Math.ceil(total.total / limit);

        if (clients.length === 0) {
            return {
                data: [],
                pagination: {
                    total: 0,
                    page,
                    totalPages: 0,
                    limit,
                },
            };
        } else
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

/**
 * Ищет клиентов по заданной строке и указанным полям поиска.
 * @param {string} string - Строка для поиска.
 * @param {string[]} searchFields - Массив полей для поиска (например, ['phone', 'name']).
 * @returns {Promise<Object[]>} - Массив клиентов, соответствующих критериям поиска.
 * @throws {Error} - В случае ошибки поиска.
 */
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

        const results = await query.select('*');
        return results || [];
    } catch (error) {
        console.error('Ошибка при поиске клиентов:', error);
        throw error;
    }
}

/**
 * Получает последние добавленные клиенты в заданном количестве.
 * @param {number} count - Количество клиентов, которые нужно вернуть.
 * @returns {Promise<Object[]>} - Массив клиентов, отсортированных по убыванию ID.
 * @throws {Error} - В случае ошибки при получении клиентов.
 */
async function getLastAddedClients(count) {
    try {
        const clients = await db('clients')
            .orderBy('id', 'desc')
            .limit(count)
            .select('*');

        return clients || [];
    } catch (err) {
        throw new Error(`Failed to retrieve clients: ${err.message}`);
    }
}

/**
 * Получает клиентов, у которых возникла ошибка при работе с Telegram.
 * @returns {Promise<Object[]>} - Массив клиентов с ошибками в Telegram (messenger_id = 2 и chat_id = 0).
 * @throws {Error} - В случае ошибки при получении клиентов.
 */
async function getClientsWithTelegramError() {
    try {
        const clients = await db('clients')
            .where('messenger_id', 2)
            .where('chat_id', 0)
            .select('*');

        return clients || [];
    } catch (err) {
        throw new Error(`Failed to retrieve clients: ${err.message}`);
    }
}

/**
 * Получает клиентов без указанного типа.
 * @returns {Promise<Object[]>} - Массив клиентов, у которых не указан тип (type = null).
 * @throws {Error} - В случае ошибки при получении клиентов.
 */
async function getClientsWithoutTypes() {
    try {
        const clients = await db('clients')
            .whereNull('type_id')
            .select('*');

        return clients || [];
    } catch (err) {
        throw new Error(`Failed to retrieve clients: ${err.message}`);
    }
}

/**
 * Фильтрует клиентов по заданным параметрам.
 * @param {Object} params - Объект с параметрами фильтрации.
 * @param {number} params.page - Номер страницы.
 * @param {number} params.limit - Количество элементов на странице.
 * @param {number} [params.type_id] - Тип клиента (опционально).
 * @param {string} [params.search_type] - Тип поиска (опционально).
 * @param {string} [params.search_string] - Строка поиска (опционально).
 * @param {boolean} [params.tg_error] - Флаг ошибки в Telegram (опционально).
 * @returns {Promise<Object>} - Объект с массивом клиентов и общим количеством страниц.
 */
async function getFilteredClients({page, limit, type_id, search_type, search_string, tg_error}) {
    try {
        let query = db('clients');

        if (type_id) query = query.where('type_id', type_id);
        if (tg_error) query = query.where('messenger_id', 2).where('chat_id', null);
        if (search_type && search_string) query = query.where(search_type, 'like', `%${search_string}%`);

        query = query.offset((page - 1) * limit).limit(limit);

        const [clients, total] = await Promise.all([
            query.clone().select('*').limit(limit).offset(offset),
            query.clone().count('* as total').first()
        ]);

        const totalPages = Math.ceil(total.total / limit);

        if (clients.length === 0) {
            return {
                data: [],
                pagination: {
                    total: 0,
                    page,
                    totalPages: 0,
                    limit,
                },
            };
        } else
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


module.exports = {
    addClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
    getClientsByTypeId,
    updateClientsMessenger,
    getClientsWithPaginationAndFilter,
    searchClients,
    getLastAddedClients,
    getClientsWithTelegramError,
    getClientsWithoutTypes,
    getFilteredClients,
    updateClientsType
};