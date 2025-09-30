const express = require('express'); 
const router = express.Router(); 
const SensorController = require('../controllers/SensorController');

//http://localhost:8080/api/sensors
router    
    .get('/', SensorController.getLatest)
    .get('/:id', SensorController.getById)
    .post('/', SensorController.create)
    .put('/:id', SensorController.updateById)
    .delete('/:id', SensorController.deleteById)

module.exports = router;