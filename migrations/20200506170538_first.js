exports.up = function (knex) {
    return Promise.all([
        knex.schema.createTable('users', table => {
            table.increments('id').primary()
            table.string('name')
            table.string('email').unique()
            table.string('cpf').unique()
            table.string('password')
            table.string('address')
            table.string('cep')

        }),

        knex.schema.createTable('courses', table => {
            table.increments('id').primary()
            table.string('title')
            table.float('price').unsigned()
            table.string('description')
            table.string('tumbnail_url')
            table.datetime('created_at').defaultTo(knex.fn.now())
            table.string('code').unique()

            table.integer('creator_id').unsigned().notNullable()
            table.foreign('creator_id').references('id').inTable('users')
        }),


        knex.schema.createTable('videos', table => {
            table.increments('id').primary()
            table.string('title')
            table.string('url')
            table.datetime('created_at').defaultTo(knex.fn.now())

            table.integer('module_id').unsigned().notNullable()
            table.foreign('module_id').references('id').inTable('modules')
        }),

        knex.schema.createTable('modules', table => {
            table.increments('id').primary()
            table.string('title')
            table.datetime('created_at').defaultTo(knex.fn.now())

            table.integer('course_id').unsigned().notNullable()
            table.foreign('course_id').references('id').inTable('courses')
        }),

        knex.schema.createTable('contents', table => {
            table.increments('id').primary()
            table.string('title')
            table.enu('type', ['video', 'link', 'document'])
            table.string('document_url')
            table.datetime('created_at').defaultTo(knex.fn.now())

            table.integer('module_id').unsigned().notNullable()
            table.foreign('module_id').references('id').inTable('modules')
        }),
    ])

};


exports.down = function (knex) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('courses'),
        knex.schema.dropTable('videos'),
        knex.schema.dropTable('contents'),
        knex.schema.dropTable('modules')
    ])
}