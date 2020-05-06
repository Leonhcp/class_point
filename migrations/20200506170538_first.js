exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('users', table => {
            table.increments('id').primary()
            table.string('name')
            table.string('email').defaultTo(null)
            table.string('cpf').unique()
            table.string('password')
            table.string('address')
        }),
    ])

};


exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('users')
    ])
}