import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const LIMITS = {
    diagnostico: 120,
    motivo: 300,
    indicaciones: 500,
};

const initialFormData = {
    fecha: "",
    motivo: "",
    diagnostico: "",
    indicaciones: "",
};

const sanitizeText = (value) => value.replace(/\s+/g, " ").trim();

function FormularioEvolucion({ onAdd }) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validate = () => {
        const nextErrors = {};

        if (!formData.fecha) {
            nextErrors.fecha = "La fecha es obligatoria.";
        } else if (formData.fecha > todayString) {
            nextErrors.fecha = "La fecha no puede ser futura.";
        }

        const diagnostico = sanitizeText(formData.diagnostico);
        const motivo = sanitizeText(formData.motivo);
        const indicaciones = sanitizeText(formData.indicaciones);

        if (!diagnostico) {
            nextErrors.diagnostico = "El diagnóstico es obligatorio.";
        } else if (diagnostico.length > LIMITS.diagnostico) {
            nextErrors.diagnostico = `Máximo ${LIMITS.diagnostico} caracteres.`;
        }

        if (!motivo) {
            nextErrors.motivo = "El motivo de consulta es obligatorio.";
        } else if (motivo.length > LIMITS.motivo) {
            nextErrors.motivo = `Máximo ${LIMITS.motivo} caracteres.`;
        }

        if (indicaciones.length > LIMITS.indicaciones) {
            nextErrors.indicaciones = `Máximo ${LIMITS.indicaciones} caracteres.`;
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return null;
        }

        return {
            fecha: formData.fecha,
            diagnostico,
            motivo,
            indicaciones,
        };
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const sanitizedData = validate();
        if (!sanitizedData) return;

        onAdd(sanitizedData);
        setFormData(initialFormData);
        setErrors({});
    };

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="fecha">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            max={todayString}
                            required
                            isInvalid={Boolean(errors.fecha)}
                        />
                        <Form.Control.Feedback type="invalid">{errors.fecha}</Form.Control.Feedback>
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
                            maxLength={LIMITS.diagnostico}
                            required
                            isInvalid={Boolean(errors.diagnostico)}
                        />
                        <Form.Text muted>{formData.diagnostico.length}/{LIMITS.diagnostico}</Form.Text>
                        <Form.Control.Feedback type="invalid">{errors.diagnostico}</Form.Control.Feedback>
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
                            maxLength={LIMITS.indicaciones}
                            isInvalid={Boolean(errors.indicaciones)}
                        />
                        <Form.Text muted>{formData.indicaciones.length}/{LIMITS.indicaciones}</Form.Text>
                        <Form.Control.Feedback type="invalid">{errors.indicaciones}</Form.Control.Feedback>
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
                            maxLength={LIMITS.motivo}
                            required
                            isInvalid={Boolean(errors.motivo)}
                        />
                        <Form.Text muted>{formData.motivo.length}/{LIMITS.motivo}</Form.Text>
                        <Form.Control.Feedback type="invalid">{errors.motivo}</Form.Control.Feedback>
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
