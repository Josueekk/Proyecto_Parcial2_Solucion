
const fs = require('fs');
const path = require('path');

const inventarioPath = path.join(__dirname, '../../data/inventario.json');
const cargaPath = path.join(__dirname, '../../data/carga.json');

// Funciones auxiliares de lectura y escritura
const leerInventario = () => JSON.parse(fs.readFileSync(inventarioPath, 'utf-8'));
const guardarInventario = (data) => fs.writeFileSync(inventarioPath, JSON.stringify(data, null, 2));

const leerCarga = () => JSON.parse(fs.readFileSync(cargaPath, 'utf-8'));
const guardarCarga = (data) => fs.writeFileSync(cargaPath, JSON.stringify(data, null, 2));

// Función auxiliar para recalcular el costo total de la carga
const recalcularTotales = (carga, inventario) => {
    let total = 0;
    carga.itemsCargados.forEach(item => {
        const producto = inventario.find(p => p.id === item.id);
        if (producto) {
            total += producto.precio * item.cantidad;
        }
    });
    carga.total = Number(total.toFixed(2));
};

// 1. POST /api/carga/agregar
const agregarACarga = (req, res) => {
    try {
        const { equipoId, cantidad } = req.body;
        const inventario = leerInventario();
        const carga = leerCarga();

        const producto = inventario.find(p => p.id === Number(equipoId));
        if (!producto) {
            return res.status(404).json({ error: "Suministro no encontrado" });
        }

        const cantSolicitada = cantidad || 1;

        // Validación de stock en base
        if (producto.stock < cantSolicitada) {
            return res.status(400).json({ error: "Stock en base insuficiente" });
        }

        const itemExistente = carga.itemsCargados.find(i => i.id === Number(equipoId));
        if (itemExistente) {
            itemExistente.cantidad += cantSolicitada;
        } else {
            carga.itemsCargados.push({ id: Number(equipoId), cantidad: cantSolicitada });
        }

        producto.stock -= cantSolicitada;
        recalcularTotales(carga, inventario);

        // Validación para no sobrepasar los creditos disponibles 
        if (carga.total > carga.creditos) {
            return res.status(400).json({ error: "Créditos insuficientes para esta cantidad" });
        }

        guardarInventario(inventario);
        guardarCarga(carga);

        res.status(200).json(carga);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar suministro a la carga" });
    }
};

// 2. PUT /api/carga/actualizar-unidades/:id
const actualizarUnidades = (req, res) => {
    try {
        const id = Number(req.params.id);
        const { cantidad } = req.body;

        if (cantidad < 0) {
            return res.status(400).json({ error: "La cantidad no puede ser negativa" });
        }

        const inventario = leerInventario();
        const carga = leerCarga();

        const producto = inventario.find(p => p.id === id);
        const itemCargado = carga.itemsCargados.find(i => i.id === id);

        if (!producto || !itemCargado) {
            return res.status(404).json({ error: "Ítem no encontrado en la carga" });
        }

        const diferencia = cantidad - itemCargado.cantidad;

        if (diferencia > 0 && producto.stock < diferencia) {
            return res.status(400).json({ error: "Stock en base insuficiente" });
        }

        let costoSimulado = 0;
        carga.itemsCargados.forEach(i => {
            const p = inventario.find(prod => prod.id === i.id);
            const cant = i.id === id ? cantidad : i.cantidad;
            costoSimulado += p.precio * cant;
        });

        if (costoSimulado > carga.creditos) {
            return res.status(400).json({ error: "Créditos insuficientes para esta cantidad" });
        }

        producto.stock -= diferencia;
        itemCargado.cantidad = cantidad;

        if (itemCargado.cantidad === 0) {
            carga.itemsCargados = carga.itemsCargados.filter(i => i.id !== id);
        }

        recalcularTotales(carga, inventario);

        guardarInventario(inventario);
        guardarCarga(carga);

        res.status(200).json(carga);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar las unidades" });
    }
};

// 3. DELETE /api/carga/eliminar/:id
const eliminarDeCarga = (req, res) => {
    try {
        const id = Number(req.params.id);
        const inventario = leerInventario();
        const carga = leerCarga();

        const itemCargado = carga.itemsCargados.find(i => i.id === id);
        if (!itemCargado) {
            return res.status(404).json({ error: "Ítem no encontrado en la carga" });
        }

        const producto = inventario.find(p => p.id === id);
        if (producto) {
            producto.stock += itemCargado.cantidad;
        }

        carga.itemsCargados = carga.itemsCargados.filter(i => i.id !== id);
        recalcularTotales(carga, inventario);

        guardarInventario(inventario);
        guardarCarga(carga);

        res.status(200).json(carga);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el suministro" });
    }
};

module.exports = {
    agregarACarga,
    actualizarUnidades,
    eliminarDeCarga
};