import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import ListaEvoluciones from "./ListaEvoluciones";
import FormularioEvolucion from "./FormularioEvolucion.jsx";
import {
    apiHistoriaDisponible,
    obtenerHistoriaClinica,
    guardarHistoriaClinica,
} from "../../helpers/apiHistoriaClinica.js";

const STORAGE_KEY = "HistoriaClinicaKey";

const HISTORIA_BASE = {
    nombre: "Nombre y apellido",
    obraSocial: "",
    nroAfiliado: "Nro afiliado",
    antecedentes: "",
    alergias: "",
    medicacionHabitual: "",
    consultas: [],
};

const sanitizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const getHistoriaId = (historia) => historia?.id ?? historia?._id ?? null;

const normalizeHistoria = (rawData = {}) => {
    const safeRaw = typeof rawData === "object" && rawData !== null ? rawData : {};

    return {
        ...HISTORIA_BASE,
        ...safeRaw,
        nombre: sanitizeText(safeRaw.nombre || HISTORIA_BASE.nombre),
        obraSocial: sanitizeText(safeRaw.obraSocial),
        nroAfiliado: sanitizeText(safeRaw.nroAfiliado || HISTORIA_BASE.nroAfiliado),
        antecedentes: sanitizeText(safeRaw.antecedentes),
        alergias: sanitizeText(safeRaw.alergias),
        medicacionHabitual: sanitizeText(
            safeRaw.medicacionHabitual ?? safeRaw.mediacionHabitual ?? ""
        ),
        consultas: Array.isArray(safeRaw.consultas) ? safeRaw.consultas : [],
    };
};

const cargarHistoria = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return HISTORIA_BASE;
        return normalizeHistoria(JSON.parse(data));
    } catch (error) {
        console.error("Error leyendo localStorage:", error);
        return HISTORIA_BASE;
    }
};

function HistoriaClinica() {
    const [historia, setHistoria] = useState(cargarHistoria);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formData, setFormData] = useState(() => ({ ...cargarHistoria() }));
    const [historiaId, setHistoriaId] = useState(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historia));
    }, [historia]);

    useEffect(() => {
        let isMounted = true;

        const cargarDesdeBackend = async () => {
            if (!apiHistoriaDisponible()) return;

            try {
                const data = await obtenerHistoriaClinica();
                if (!data || !isMounted) return;

                const normalizada = normalizeHistoria(data);
                setHistoria(normalizada);
                setFormData(normalizada);
                setHistoriaId(getHistoriaId(data));
            } catch (error) {
                console.error("No se pudo obtener historia clínica del backend:", error);
            }
        };

        cargarDesdeBackend();

        return () => {
            isMounted = false;
        };
    }, []);

    const persistirHistoria = async (historiaActualizada) => {
        if (!apiHistoriaDisponible()) return;

        try {
            const payload = historiaId
                ? { ...historiaActualizada, id: historiaId }
                : historiaActualizada;
            const guardada = await guardarHistoriaClinica(payload);
            if (!guardada) return;

            const normalizada = normalizeHistoria(guardada);
            setHistoria(normalizada);
            setFormData(normalizada);

            const idGuardado = getHistoriaId(guardada);
            if (idGuardado) setHistoriaId(idGuardado);
        } catch (error) {
            console.error("No se pudo guardar historia clínica en backend:", error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const guardarCambios = () => {
        const actualizada = normalizeHistoria(formData);
        setHistoria(actualizada);
        setModoEdicion(false);
        persistirHistoria(actualizada);
    };

    const cancelarEdicion = () => {
        setFormData({ ...historia });
        setModoEdicion(false);
    };

    const agregarConsulta = (nuevaConsulta) => {
        const actualizada = {
            ...historia,
            consultas: [...(Array.isArray(historia.consultas) ? historia.consultas : []), nuevaConsulta],
        };

        setHistoria((prev) => ({
            ...prev,
            consultas: [...(Array.isArray(prev.consultas) ? prev.consultas : []), nuevaConsulta],
        }));
        persistirHistoria(actualizada);
    };

    return (
        <Container className="my-4">
            <Row className="mb-3">
                <Col>
                    <h2>Historia clínica del paciente</h2>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card className="mb-3">
                        <Card.Header>
                            Datos generales
                            <div className="float-end">
                                {!modoEdicion && (
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => setModoEdicion(true)}
                                    >
                                        Editar
                                    </Button>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {modoEdicion ? (
                                <>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            maxLength={120}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Obra social</Form.Label>
                                        <Form.Select
                                            name="obraSocial"
                                            value={formData.obraSocial}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona una obra social</option>
                                            <option value="OSDE">OSDE</option>
                                            <option value="Osecac">Osecac</option>
                                            <option value="PAMI">PAMI</option>
                                            <option value="Particular">Particular</option>
                                            <option value="Red de Seguro Medico">Red de Seguro Medico</option>
                                            <option value="SancorSalud">SancorSalud</option>
                                            <option value="Subsidio Salud">Subsidio Salud</option>
                                            <option value="Swiss Medical">Swiss Medical</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Nro de afiliado</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nroAfiliado"
                                            value={formData.nroAfiliado}
                                            onChange={handleChange}
                                            maxLength={40}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Antecedentes</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="antecedentes"
                                            value={formData.antecedentes}
                                            onChange={handleChange}
                                            maxLength={300}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Alergias</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="alergias"
                                            value={formData.alergias}
                                            onChange={handleChange}
                                            maxLength={300}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Medicación habitual</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="medicacionHabitual"
                                            value={formData.medicacionHabitual}
                                            onChange={handleChange}
                                            maxLength={300}
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={guardarCambios}
                                        className="me-2"
                                    >
                                        Guardar
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={cancelarEdicion}>
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <p><strong>Nombre y apellido:</strong> {historia.nombre}</p>
                                    <p><strong>Obra social:</strong> {historia.obraSocial || "-"}</p>
                                    <p><strong>Nro de afiliado:</strong> {historia.nroAfiliado}</p>
                                    <p><strong>Antecedentes:</strong> {historia.antecedentes || "-"}</p>
                                    <p><strong>Alergias:</strong> {historia.alergias || "-"}</p>
                                    <p><strong>Medicación habitual:</strong> {historia.medicacionHabitual || "-"}</p>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-3">
                        <Card.Header>Consultas/Evoluciones</Card.Header>
                        <Card.Body>
                            <ListaEvoluciones consultas={historia.consultas} />
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header>Nueva consulta</Card.Header>
                        <Card.Body>
                            <FormularioEvolucion onAdd={agregarConsulta} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default HistoriaClinica;
