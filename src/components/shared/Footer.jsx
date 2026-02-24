import { Container, Row, Col } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import image from "../../../public/img/Bienestar360.png";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <Container fluid className="footer-container">
                <Row className="footer-top justify-content-center text-center text-md-start">
                    
                    {/* Logo y slogan */}
                    <Col xs={12} md={4} className="footer-logo mb-4 mb-md-0">
                        <img src={image} alt="Logo Clinica" />
                        <p className="footer-slogan centered-text">
                            Salud que te envuelve
                        </p>
                    </Col>

                    {/* Sobre la clínica */}
                    <Col xs={12} md={4} className="footer-column mb-4 mb-md-0">
                        <h4>Sobre la clínica</h4>
                        <Nav className="flex-column footer-nav align-items-center align-items-md-start">
                            <Nav.Link href="#">Nosotros</Nav.Link>
                            <Nav.Link href="#">Contacto</Nav.Link>
                        </Nav>
                    </Col>

                    {/* Contacto y ubicación */}
                    <Col xs={12} md={4} className="footer-column">
                        <h4>Ubicación</h4>
                        <p>📍General Paz 576, San Miguel de Tucumán</p>
                    </Col>

                </Row>

                {/* Copyright */}
                <Row className="footer-bottom mt-4">
                    <Col className="text-center">
                        <small>
                            © 2026 Clínica Bienestar 360. Todos los derechos reservados.
                        </small>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;