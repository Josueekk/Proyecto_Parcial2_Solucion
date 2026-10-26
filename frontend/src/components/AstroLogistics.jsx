// Vista para la parte de Ejercicio 2
import React from 'react';
import { Container, Button } from 'reactstrap';

const AstroLogistics = ({ volver }) => {
  return (
    <Container className="py-5 text-center">
      <h2 className="text-info">🚀 AstroLogistics Ltd.</h2>
      <p>Aquí construiremos el catálogo y la bodega.</p>
      <Button color="secondary" onClick={volver}>Volver al Menú</Button>
    </Container>
  );
};

export default AstroLogistics;