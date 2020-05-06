const config = require('../knexfile.js')
const knex = require('knex')(config)
const bookshelf = require('bookshelf')(knex);
const mongoose = require('mongoose');

// TODO - COLOCAR LINK EM UM ARQUIVO E EXPORTAR PARA UTILIZAR
mongoose.connect('mongodb://localhost:27017/classpoint', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

module.exports = {
    bookshelf,
    mongoose,
    knex
}