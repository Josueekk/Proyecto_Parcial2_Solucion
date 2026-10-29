// Generamos una temperatura aleatoria
let temperaturaRandom = Math.floor(Math.random() * 100) + 1;

// Funcion POST /adjust
const ajustarTemperatura = (req, res) => {
    // Recibimos la temperatura ingresada
    const { temperatura } = req.body;

    // Validacion basica (Numero valido)
    if (typeof temperatura !== 'number') {
        return res.status(400).json({ error: "Debes ingresar una temperatura valida." });
    }
    // Validacion de rango (No negativo y no mayor a 100)
    if (temperatura < 0 || temperatura > 100) {
        return res.status(400).json({ error: "La temperatura debe estar entre 0 y 100." });
    }

    //Respondemos si la temperatura es: estabilizado
    if (temperatura === temperaturaRandom) {
        return res.status(200).json({ estado: 'Estabilizado', mensaje: 'El reactor ha sido estabilizado.' })
    } else if (temperatura < temperaturaRandom) {
        // Responde si la temperatura es mas alta
        return res.status(200).json({ estado: 'Más alta', mensaje: 'La temperatura ideal es más alta.' })
    } else if (temperatura > temperaturaRandom) {
        // Responde si la temperatura es mas baja
        return res.status(200).json({ estado: 'Más baja', mensaje: 'La temperatura ideal es más baja.' })
    }
};

// Funcion para POST /reboot
const reiniciarReactor = (req, res) => {
    // Reiniciamos la temperatura y generamos una nueva temperatura de estabilizacion
    temperaturaRandom = Math.floor(Math.random() * 100) + 1;

    // Mensaje de existo al reinicar
    return res.status(200).json({
        estado: 'Sistema reiniciado',
        mensaje: 'Sistema reiniciado con éxito. Se genero una nueva temperatura.'
    });
};

// Exportamos las funciones
module.exports = {
    ajustarTemperatura,
    reiniciarReactor
};