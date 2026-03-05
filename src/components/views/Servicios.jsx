import { Container, Row, Col, Card } from "react-bootstrap";

const Servicios = () => {
  return (
    <Container className="py-5">
      
      <div className="text-center mb-5">
        <i className="bi bi-hospital-fill text-dark" style={{ fontSize: "2.5rem" }}></i>
        <h2 className="fw-bold text-dark mt-3">Nuestros Servicios</h2>
        <p className="text-muted mt-3">
          En nuestra clínica ofrecemos soluciones médicas integrales 
          combinando tecnología, profesionalismo y atención humana.
        </p>
      </div>

      <Row className="g-4">

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100 text-center p-3">
            <i className="bi bi-calendar-check-fill text-success mb-3" style={{ fontSize: "2rem" }}></i>
            <h5 className="fw-bold">Gestión de Turnos</h5>
            <p className="text-muted">
              Sistema rápido y eficiente para solicitar, modificar y 
              cancelar turnos médicos en línea.
            </p>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100 text-center p-3">
            <i className="bi bi-file-medical-fill text-muted mb-3" style={{ fontSize: "2rem" }}></i>
            <h5 className="fw-bold">Historia Clínica Digital</h5>
            <p className="text-muted">
              Registro médico digital seguro que permite a los 
              profesionales acceder a la información del paciente 
              en cualquier momento.
            </p>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100 text-center p-3">
            <i className="bi bi-heart-pulse-fill text-danger mb-3" style={{ fontSize: "2rem" }}></i>
            <h5 className="fw-bold">Guardia Médica</h5>
            <p className="text-muted">
              Atención inmediata ante urgencias médicas con un equipo 
              profesional capacitado y disponible.
            </p>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100 text-center p-3">
            <i className="bi bi-credit-card-fill text-info mb-3" style={{ fontSize: "2rem" }}></i>
            <h5 className="fw-bold">Gestión de Pagos</h5>
            <p className="text-muted">
              Plataforma segura para realizar pagos de consultas 
              y servicios médicos de forma rápida y confiable.
            </p>
          </Card>
        </Col>

      </Row>

      <div className="mt-5 text-center">
        <h4 className="fw-bold text-secondary">Compromiso con la Salud</h4>
        <p className="text-muted mt-3">
          Nuestra misión es brindar atención médica de calidad, 
          centrada en el paciente y respaldada por tecnología 
          innovadora que garantiza seguridad y eficiencia 
          en cada proceso.
        </p>
      </div>

    </Container>
  );
};

export default Servicios;