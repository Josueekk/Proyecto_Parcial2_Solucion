const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares 
app.use(cors());
app.use(express.json()); // Leer req.body en formato json 

// Importamos la ruta
const reactorRoutes = require('./routes/reactorRoutes');
// Montamos las rutas
app.use('/', reactorRoutes);

//importamos la ruta de inventario  
const inventarioRoutes = require('./routes/inventarioRoutes');
// Montamos las rutas
app.use('/api', inventarioRoutes);

//importamos la ruta de carga  
const CargaRoutes = require('./routes/CargaRoutes');
// Montamos las rutas
app.use('/api', CargaRoutes);

// Iniciamos el servidor
app.listen(PORT, () =>{
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});