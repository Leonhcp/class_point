const express = require('express')
const consign = require('consign')
const app = require('express')()
const bodyParser = require('body-parser')
const db = require('./config/db')

app.use(bodyParser.json())

app.db = db

require('dotenv').config();

consign()
    .include('./config/passport.js')
    .then('./middlewares')
    .then('./utils')
    .then('./model')
    .then('./api')
    .then('./routes')
    .into(app)

app.listen(3009, () => {
    console.log('Backend funcionando...')
})