import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import Reactor from './components/Reactor';
import AstroLogistics from './components/AstroLogistics';

function App() {
  // Estado para controlar que pantalla se muestra
  // Menu; Reactor; astrologistics
  const [vista, setVista] = useState('menu');

  // Renderizamos segun la condicion
  if (vista === 'reactor') {
    return <Reactor volver={() => setVista('menu')} />;
  }

  if (vista === 'astrologicts') {
    return <AstroLogistics volver={() => setVista('menu')} />;
  }
  // Vista principal (Menú)
  return (
    <Container className="py-5">
      <h1 className="text-center mb-5 fw-bold text-primary">Plataforma de Control</h1>

      <Row className="justify-content-center">
        {/* Opción 1: Reactor */}
        <Col md="5" className="mb-4">
          <Card className="h-100 shadow-sm text-center border-danger">
            <CardBody className="d-flex flex-column">
              <CardTitle tag="h3" className="text-danger mb-3">⚛️ Reactor</CardTitle>
              <CardText className="flex-grow-1 text-muted">
                Accede a la consola de seguridad para estabilizar el núcleo térmico antes de que colapse.
              </CardText>
              <Button color="danger" size="lg" onClick={() => setVista('reactor')}>
                Ingresar al Reactor
              </Button>
            </CardBody>
          </Card>
        </Col>

        {/* Opción 2: AstroLogistics */}
        <Col md="5" className="mb-4">
          <Card className="h-100 shadow-sm text-center border-info">
            <CardBody className="d-flex flex-column">
              <CardTitle tag="h3" className="text-info mb-3">🚀 AstroLogistics</CardTitle>
              <CardText className="flex-grow-1 text-muted">
                Gestiona el catálogo de suministros, verifica el stock y prepara la carga de la nave.
              </CardText>
              <Button color="info" size="lg" className="text-white" onClick={() => setVista('astrologicts')}>
                Ingresar a Logística
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;