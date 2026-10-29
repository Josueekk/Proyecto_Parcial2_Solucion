// Vista para la parte de reactor Ejercicio 1
import React, { useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardTitle,
  Form, FormGroup, Input, Button, Alert, ListGroup, ListGroupItem
} from 'reactstrap';

const Reactor = ({ volver }) => {
  // 1.Constroles de temperatura del sistema con useState
  const [temperatura, setTemperatura] = useState('');
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [estabilizado, setEstabilizado] = useState(false);

  // Funcion para enviar el intento del backend
  const manejarAjuste = async (e) => {
    e.preventDefault(); // Evita que react se reinicie al ajustar la temperatura
    // Validar que el campo no este vacio
    if (!temperatura) return;

    // Realizamos la consulta al backend
    try {
      const response = await fetch('/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperatura: Number(temperatura) })
      });
      // Convertimos la respuesta a un objeto de javascript
      const data = await response.json();

      // Validacion de un numero fuera del rango
      if (!response.ok) {
        setMensaje({ texto: data.error, color: 'danger' });
        setTemperatura('');
        return; 
      }

      // Guardamos en el historial
      setHistorial([...historial, { temp: temperatura, pista: data.estado }]);

      // Verificacion del estado 
      if (data.estado.toLowerCase() === 'estabilizado') {
        setEstabilizado(true);
        setMensaje({ texto: data.mensaje, color: 'success' });
      } else {
        setMensaje({ texto: data.mensaje, color: 'warning' });
      }
      // Limpiamos el input
      setTemperatura('');
    } catch (error) {
      setMensaje({ texto: 'Error al conectar con el servidor', color: 'danger' });
    }
  };
  // Funcion para reinicar el sistema
  const reiniciarSistema = async () => {
    try {
      const response = await fetch('/reboot', { method: 'POST' });
      const data = await response.json();

      // Reiniciamos los estados
      setHistorial([]);
      setEstabilizado(false);
      setMensaje({ texto: data.mensaje, color: 'info' });
      setTemperatura('');
    } catch (error) {
      setMensaje({ texto: 'Error al iniciar el servidor.', color: 'danger' });
    }
  };

  return (<Container className="py-5">
      <Button color="secondary" outline className="mb-4" onClick={volver}>
        &larr; Volver al Menú
      </Button>

      <Row className="justify-content-center">
        <Col md="6">
          <Card className="shadow-sm border-danger">
            <CardBody className="text-center">
              <CardTitle tag="h3" className="text-danger mb-4">
                 Estabiliza el Reactor
              </CardTitle>

              {/* Mensaje de advertencia del servidor */}
              {mensaje && (
                <Alert color={mensaje.color}>
                  {mensaje.texto}
                </Alert>
              )}

              {/* Formulario con input numérico y botón */}
              <Form onSubmit={manejarAjuste}>
                <FormGroup className="d-flex gap-2">
                  <Input
                    type="number"
                    placeholder="Ingresa la temperatura (1-100)"
                    value={temperatura}
                    onChange={(e) => setTemperatura(e.target.value)}
                    disabled={estabilizado}
                    required
                  />
                  <Button color="danger" type="submit" disabled={estabilizado}>
                    Ajustar
                  </Button>
                </FormGroup>
              </Form>

              {/* Botón de reinicio (POST /reboot) */}
              <Button 
                color="dark" 
                className="mt-3 w-100" 
                onClick={reiniciarSistema}
              >
                 Reiniciar Sistema
              </Button>
            </CardBody>
          </Card>
        </Col>

        <Col md="4">
          <Card className="shadow-sm h-100">
            <CardBody>
              <CardTitle tag="h5" className="mb-3">Historial de Intentos</CardTitle>
              
              {/* Lista dinámica con el registro de temperaturas */}
              <ListGroup flush>
                {historial.length === 0 ? (
                  <p className="text-muted text-center mt-3">No hay intentos aún.</p>
                ) : (
                  historial.map((intento, index) => (
                    <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                      <span>Intento {index + 1}: <strong>{intento.temp}°C</strong></span>
                      <span className={`badge ${intento.pista.toLowerCase() === 'estabilizado' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {intento.pista}
                      </span>
                    </ListGroupItem>
                  ))
                )}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reactor;