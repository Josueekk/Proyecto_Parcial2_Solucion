const express = require('express');
const router = express.Router();
const { 
    agregarACarga, 
    actualizarUnidades, 
    eliminarDeCarga 
} = require('../controllers/CargaController');

router.post('/carga/agregar', agregarACarga);
router.put('/carga/actualizar-unidades/:id', actualizarUnidades);
router.delete('/carga/eliminar/:id', eliminarDeCarga);

module.exports = router;