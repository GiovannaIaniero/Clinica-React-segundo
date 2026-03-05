import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useState } from "react";
import { useRef } from "react";

const Contacto = () => {

    const [enviado, setEnviado] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setTimeout(() => {
            setEnviado(true);
            e.target.reset();
        }, 800); 
    };

    const sendEmail = (e) => {
        e.preventDefault();

        const nombre = e.target.user_name.value;
        const email = e.target.user_email.value;
        const mensaje = e.target.message.value;

        const asunto = `Consulta de ${nombre}`;
        const cuerpo = `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`;

        window.location.href = `mailto:tomasignacioponce17@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    };

    return (
        <Container className="py-5 d-flex justify-content-center">
            <Card className="shadow-lg border-0 p-4" style={{ maxWidth: "600px", width: "100%" }}>

                <div className="text-center mb-4">
                    <i className="bi bi-envelope-paper-fill text-dark" style={{ fontSize: "2.5rem" }}></i>
                    <h2 className="fw-bold text-dark mt-3">Contacto</h2>
                    <p className="text-muted">Envíanos tu consulta</p>
                </div>

                {enviado && (
                    <Alert variant="success" className="text-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Mensaje enviado correctamente ✅
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="bi bi-person-fill me-2 text-dark"></i>
                            Nombre
                        </Form.Label>
                        <Form.Control type="text" placeholder="Ingrese su nombre" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="bi bi-envelope-fill me-2 text-dark"></i>
                            Email
                        </Form.Label>
                        <Form.Control type="email" placeholder="Ingrese su email" required />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>
                            <i className="bi bi-chat-left-text-fill me-2 text-dark"></i>
                            Mensaje
                        </Form.Label>
                        <Form.Control as="textarea" rows={4} placeholder="Escriba su mensaje..." required />
                    </Form.Group>

                    <Button
                        variant="success"
                        type="submit"
                        className="fw-bold w-100 shadow-sm"
                    >
                        <i className="bi bi-send-fill me-2"></i>
                        Enviar Mensaje
                    </Button>

                </Form>
            </Card>
        </Container>
    );
};

export default Contacto;