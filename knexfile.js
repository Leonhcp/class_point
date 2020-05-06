// Update with your config settings.

module.exports = {

  client: 'mysql',
  connection: {
    database: 'class_point',
    user: 'root',
    password: 'Mercadata2019!'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }

};
