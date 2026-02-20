import { Container, Row, Col} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import image from "../../../public/img/Bienestar360.png"
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <Container className= "footer-container">
                <Row>
                    <Col className="footer-logo">
                    <img src={image} alt="Logo" />
                    <p>Salud que te envuelve</p>
                    </Col>
                
                <Col className="footer-column">
                    <Nav className="flex-column footer-nav">
                    <Nav.Item>
                        <strong>Pacientes</strong>
                    </Nav.Item>
                    <Nav.Link href="#">Turnos</Nav.Link>
                    <Nav.Link href="#">Mis turnos</Nav.Link>
                    <Nav.Link href="#">Login</Nav.Link>
                    <Nav.Link href="#">Registro</Nav.Link>
                </Nav>
            </Col>

            <Col className="footer-column">
                <Nav className="flex-column footer-nav">
                    <Nav.Item>
                    <strong>Profesionales</strong>
                    </Nav.Item>
                    <Nav.Link href="#">Panel</Nav.Link>
                    <Nav.Link href="#">Login</Nav.Link>
                    <Nav.Link href="#">Registro</Nav.Link>
                </Nav>   
            </Col>
            
            <Col className="footer-column">
                <Nav className="flex-column footer-nav">
                    <Nav.Item>
                    <strong>Sobre la clínica</strong>
                    </Nav.Item>
                <Nav.Link href="#">Nosotros</Nav.Link>
                <Nav.Link href="#">Especialides</Nav.Link>
                <Nav.Link href="#">Contacto</Nav.Link>
                </Nav> 
            </Col>

                </Row>
            </Container>
        </footer>
    );
}

export default Footer;