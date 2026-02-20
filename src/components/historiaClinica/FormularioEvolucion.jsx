import { useState } from "react";
import {Form, Button, Row, Col } from "react-bootstrap";

function FormularioEvolucion({ onAdd }) {
    const [formData, setFormData] = useState({
        fecha: "",
        motivo: "",
        diagnostico: "",
        indicaciones: "",
    });

    const today = new Date()
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onAdd(formData);

        setFormData({
            fecha: "",
            motivo: "",
            diagnostico: "",
            indicaciones: "",
        });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="fecha">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        min={todayString}
                        required
                    />
                    </Form.Group>
                </Col>
            </Row>

    <Row className="mb-3">
        <Col>
        <Form.Group controlId="diagnostico">
            <Form.Label>Diagnóstico</Form.Label>
            <Form.Control
            type="text"
            name="diagnostico"
            placeholder="Diagnóstico"
            value={formData.diagnostico}
            onChange={handleChange}
            required
            />
        </Form.Group>
        </Col>
    </Row>

    <Row className="mb-3">
        <Col>
        <Form.Group controlId="indicaciones">
            <Form.Label>Indicaciones</Form.Label>
            <Form.Control
            as="textarea"
            rows={3}
            name="indicaciones"
            placeholder="Indicaciones para el paciente"
            value={formData.indicaciones}
            onChange={handleChange}
            />
        </Form.Group>
        </Col>
    </Row>

    <Row className="mb-3">
        <Col>
        <Form.Group controlId="motivo">
            <Form.Label>Motivo</Form.Label>
            <Form.Control
            as="textarea"
            rows={3}
            name="motivo"
            placeholder="Motivo de consulta"
            value={formData.motivo}
            onChange={handleChange}
            />
        </Form.Group>
        </Col>
    </Row>

    <Button type="submit" variant="primary">
        Agregar consulta
    </Button>
</Form>
);
}

export default FormularioEvolucion;