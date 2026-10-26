// Conectamos las funciones del controlador con los endpoints HTTP
const express = require('express');
const router = express.Router();
// Constrolador
const reactorController = require('../controllers/reactorController.js');

// RUTA POST /adjust
router.post('/adjust', reactorController.ajustarTemperatura);

// RUTA POST /reboot
router.post('/reboot', reactorController.reiniciarReactor);

module.exports = router;