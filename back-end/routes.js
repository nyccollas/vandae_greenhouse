const express = require('express')
const routes = express.Router()

const sensor = require('./controllers/sensors')
routes.post('/sensors', sensor.create)

module.exports = routes
