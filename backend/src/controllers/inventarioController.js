const fs = require ('fs');
const path = require('path');

//Rutas Json 
const inventarioPath = path.join(__dirname, '../../data/inventario.json');
const cargaPath = path.join(__dirname, '../../data/carga.json');

//Funciones auxiliares para leer archivos JSON
const leerInventario = () => JSON.parse(fs.readFileSync(inventarioPath, 'utf-8'));
const leerCarga = () => JSON.parse(fs.readFileSync(cargaPath, 'utf-8'));

//Get inventario

const getInventario = (req, res) => {
    try {
        const inventario = leerInventario();
        res.status(200).json(inventario);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer datos del inventario.' });
    }   
};

//Get carga

const getCarga = (req, res) => {
    try {
        const carga = leerCarga();
        res.status(200).json(carga);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer datos de la carga.' });
    }
};    

module.exports = {
    getInventario,
    getCarga
};




