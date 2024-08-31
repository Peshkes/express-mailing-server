/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async knex => {
    await knex.schema.createTable('client_types', table => {
        table.increments('id').primary();
        table.string('type_name').notNullable();
    });

    await knex.schema.createTable('messengers', table => {
        table.increments('id').primary();
        table.string('messanger_name').notNullable();
    });

    await knex.schema.createTable('clients', table => {
        table.increments('id').primary();
        table.string('phone_number').notNullable();
        table.string('name').notNullable();
        table.integer('type_id').unsigned().references('id').inTable('client_types');
        table.integer('messanger_id').unsigned().references('id').inTable('messangers');
        table.timestamp('check_in_date');
        table.timestamp('check_out_date');
        table.bigInteger('chat_id').defaultTo(null);
    });

    await knex.schema.createTable('messages', table => {
        table.increments('id').primary();
        table.string('theme').notNullable();
        table.text('message_text').notNullable();
        table.integer('recipient_type_id').unsigned().references('id').inTable('client_types');
        table.string('media_path');
        table.timestamp('sending_date');
    });
    
    await knex.schema.createTable('samples', table => {
        table.increments('id').primary();
        table.string('sample_name').notNullable();
        table.string('theme').notNullable();
        table.text('message_text').notNullable();
        table.integer('recipient_type_id').unsigned().references('id').inTable('client_types');
        table.string('media_path');
        table.timestamp('sending_date');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async knex => {
    await knex.schema.dropTableIfExists('messages');
    await knex.schema.dropTableIfExists('clients');
    await knex.schema.dropTableIfExists('client_types');
    await knex.schema.dropTableIfExists('messangers');
};
