const express = require('express'); 
const router = express.Router();
const { getInventario, getCarga } = require('../controllers/inventarioController');

//definicion de endpoints
router.get('/inventario', getInventario);
router.get('/carga', getCarga);

module.exports = router;