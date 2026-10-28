import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardTitle,
  Table, Button, Alert, Badge
} from 'reactstrap';

const AstroLogistics = ({ volver }) => {
  const [inventario, setInventario] = useState([]);
  const [carga, setCarga] = useState({ itemsCargados: [], creditos: 500, total: 0 });
  const [mensaje, setMensaje] = useState(null);

  // Función para obtener los datos del backend (Inventario y Carga)
  const cargarDatos = async () => {
    try {
      const resInv = await fetch('http://localhost:3000/api/inventario');
      const dataInv = await resInv.json();
      setInventario(dataInv);

      const resCarga = await fetch('http://localhost:3000/api/carga');
      const dataCarga = await resCarga.json();
      setCarga(dataCarga);
    } catch (error) {
      setMensaje({ texto: 'Error al conectar con el servidor', color: 'danger' });
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // 1. POST: Agregar suministro a la carga
  const agregarACarga = async (equipoId) => {
    try {
      const response = await fetch('http://localhost:3000/api/carga/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipoId, cantidad: 1 })
      });
      const data = await response.json();

      if (!response.ok) {
        setMensaje({ texto: data.error || 'Error al agregar', color: 'danger' });
        return;
      }

      setCarga(data);
      setMensaje({ texto: 'Suministro agregado a la nave exitosamente', color: 'success' });
      cargarDatos(); // Refrescar inventario general para ver el stock reducido
    } catch (error) {
      setMensaje({ texto: 'Error de red al agregar ítem', color: 'danger' });
    }
  };

  // 2. PUT: Actualizar unidades de un ítem en la carga
  const cambiarCantidad = async (id, nuevaCantidad) => {
    if (nuevaCantidad < 0) return;
    try {
      const response = await fetch(`http://localhost:3000/api/carga/actualizar-unidades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: nuevaCantidad })
      });
      const data = await response.json();

      if (!response.ok) {
        setMensaje({ texto: data.error || 'Error al actualizar', color: 'danger' });
        return;
      }

      setCarga(data);
      setMensaje(null);
      cargarDatos();
    } catch (error) {
      setMensaje({ texto: 'Error de red al actualizar', color: 'danger' });
    }
  };

  // 3. DELETE: Eliminar suministro de la carga
  const eliminarDeCarga = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/carga/eliminar/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (!response.ok) {
        setMensaje({ texto: data.error || 'Error al eliminar', color: 'danger' });
        return;
      }

      setCarga(data);
      setMensaje({ texto: 'Suministro devuelto al inventario de la base', color: 'info' });
      cargarDatos();
    } catch (error) {
      setMensaje({ texto: 'Error de red al eliminar', color: 'danger' });
    }
  };

  return (
    <Container className="py-4">
      {/* Botón para volver al menú principal */}
      <Button color="secondary" outline className="mb-3" onClick={volver}>
        &larr; Volver al Menú
      </Button>

      <h2 className="text-info mb-4 text-center">🚀 AstroLogistics Ltd. - Gestión de Misión</h2>

      {/* Alertas del sistema */}
      {mensaje && (
        <Alert color={mensaje.color} toggle={() => setMensaje(null)}>
          {mensaje.texto}
        </Alert>
      )}

      {/* PANEL SUPERIOR: Créditos y Costos Totales */}
      <Row className="mb-4">
        <Col md="6">
          <Card className="shadow-sm border-info text-center bg-light">
            <CardBody>
              <CardTitle tag="h5">Créditos Disponibles</CardTitle>
              <h3 className="text-success">{carga.creditos || 500} CR</h3>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card className="shadow-sm border-warning text-center bg-light">
            <CardBody>
              <CardTitle tag="h5">Costo Total de Carga</CardTitle>
              <h3 className="text-danger">{carga.total || 0} CR</h3>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* COLUMNA IZQUIERDA: Catálogo de Suministros (Inventario Base) */}
        <Col md="6">
          <Card className="shadow-sm mb-4">
            <CardBody>
              <CardTitle tag="h4" className="text-primary mb-3">📦 Catálogo de Suministros</CardTitle>
              <Table striped responsive hover size="sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock Base</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {inventario.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>{item.precio} CR</td>
                      <td>
                        <Badge color={item.stock > 0 ? 'success' : 'danger'}>
                          {item.stock}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          disabled={item.stock <= 0}
                          onClick={() => agregarACarga(item.id)}
                        >
                          Cargar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        {/* COLUMNA DERECHA: Bodega (Carga de la Nave) */}
        <Col md="6">
          <Card className="shadow-sm mb-4">
            <CardBody>
              <CardTitle tag="h4" className="text-success mb-3">🛸 Bodega de la Nave</CardTitle>
              {(!carga.itemsCargados || carga.itemsCargados.length === 0) ? (
                <p className="text-muted text-center py-4">La bodega de la nave está vacía.</p>
              ) : (
                <Table striped responsive hover size="sm">
                  <thead>
                    <tr>
                      <th>Ítem ID</th>
                      <th>Cantidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carga.itemsCargados.map((item) => {
                      const productoInfo = inventario.find(p => p.id === item.id);
                      return (
                        <tr key={item.id}>
                          <td>{productoInfo ? productoInfo.nombre : `ID: ${item.id}`}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Button
                                color="secondary"
                                size="sm"
                                onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                              >
                                -
                              </Button>
                              <span className="fw-bold px-2">{item.cantidad}</span>
                              <Button
                                color="secondary"
                                size="sm"
                                onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => eliminarDeCarga(item.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AstroLogistics;