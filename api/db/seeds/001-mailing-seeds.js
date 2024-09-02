exports.seed = async function (knex) {
    await knex('client_types').truncate();
    await knex('messengers').truncate();

    await knex('client_types').insert([
        {type_name: 'Взрослые'},
        {type_name: 'Семьи с детьми'}
    ]);

    await knex('messengers').insert([
        {messanger_name: 'WhatsApp'},
        {messanger_name: 'Telegram'}
    ]);
};
