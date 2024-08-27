// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './api/db/dev.mailing.db3'
    },
    migrations: {
      directory: './api/db/migrations'
    },
    seeds: {
      directory: './api/db/seeds'
    },
    useNullAsDefault: true,
  },
};
