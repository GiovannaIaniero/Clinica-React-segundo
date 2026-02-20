import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import errorImage from '../../../public/img/img-error.png';

function Error404() {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="text-center p-4 shadow-sm">
                        <Card.Body>
                            <img
                                src={errorImage}
                                alt="Error 404"
                                className="img-fluid mb-5 mx-auto d-block"
                                style={{ maxWidth: "500px" }

                            }
                            />

                            <div className="d-flex gap-2 justify-content-center">
                                <Button as={Link} to="/" variant="primary">
                                    Volver al inicio
                                </Button>
                                <Button
                                    as="a"
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=tomasignacioponce17@gmail.com"
                                    variant="outline-secondary"
                                    target="_blank"
                                >
                                    Contactar soporte
                                </Button>
                                
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Error404;    