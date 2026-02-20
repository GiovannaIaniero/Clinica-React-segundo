import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { validarTurnoCompleto } from '../../helpers/turnos/ValidacionesTurnos';
import { useNavigate } from "react-router-dom";
import { getRoleFromToken } from '../../helpers/login/apiLogin.js';

const CrearTurno = ({
    show,
    onClose,
    onSave,
    mode,
    turnoEdit,
    pacientesMock,
    medicosMock,
    turnos,
    nuevoTurno
}) => {

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const role = getRoleFromToken();

    const isAdmin = role === "admin"
    const isUser = role === "user"
    const isMedico = role === "medico"

    useEffect(() => {
        if (mode === "editar" && turnoEdit) {
            setForm(turnoEdit);
        } else if (mode === "crear") {
            reset();
        }
    }, [mode, turnoEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const mensajeError = validarTurnoCompleto(turnos, form, turnoEdit);

        if (mensajeError) {
            setError(mensajeError);
            return;
        }

        setError("");

        // 👤 SI ES USUARIO → ir a pantalla de pago
        if (isUser && form.metodoPago === "tarjeta") {
            navigate("/pago", {
                state: form
            });
            return;
        }

        // 👨‍⚕️ ADMIN / MÉDICO → flujo original
        const success = await onSave(form);

        if (success) {
            onClose();
        }

        if (mode === "crear") reset();
    };

    const estado = () => {
        if (mode === "crear") {
            return "Pendiente";
        } else if (mode === "editar" && turnoEdit) {

            return turnoEdit.estado;
        }
    };

    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        pacienteNombre: "",
        medicoNombre: "",
        fecha: "",
        hora: "",
        motivoConsulta: "",
        metodoPago: "",
        precio: 5000,
        estado: estado()
    });
    const reset = () => {
        setForm({
            pacienteNombre: "",
            medicoNombre: "",
            fecha: "",
            hora: "",
            motivoConsulta: "",
            metodoPago: "",
            precio: 5000,
            estado: estado()
        });
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {mode === "crear" ? "Crear Turno" : "Editar Turno"}
                </Modal.Title>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <h5>Paciente</h5>
                    {!isUser ? (
                        <select
                            value={form.pacienteNombre}
                            onChange={e => setForm({ ...form, pacienteNombre: e.target.value })}
                            className="form-select"
                            required
                        >
                            <option value="">Seleccionar paciente</option>
                            {pacientesMock.map(p => (
                                <option key={p.id} value={p.nombre}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            placeholder="Escriba su nombre completo"
                            value={form.pacienteNombre}
                            onChange={e => setForm({ ...form, pacienteNombre: e.target.value })}
                            className="form-control"
                            required
                        />
                    )}

                    <h5>Médico</h5>
                    <select
                        value={form.medicoNombre}
                        onChange={e => setForm({ ...form, medicoNombre: e.target.value })}
                        className='form-select'
                        required
                    >
                        <option value="">Seleccionar médico</option>
                        {medicosMock.map(m => (
                            <option key={m.id} value={m.nombre}>{m.nombre}</option>
                        ))}
                    </select>

                    <h5>Fecha</h5>
                    <Form.Control
                        type="date"
                        value={form.fecha}
                        min={today}
                        onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                        required
                    />

                    <h5>Hora</h5>
                    <Form.Control
                        type="time"
                        value={form.hora}
                        onChange={(e) => setForm({ ...form, hora: e.target.value })}
                        required
                    />

                    <h5>Motivo de Consulta</h5>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={form.motivoConsulta}
                        onChange={(e) =>
                            setForm({ ...form, motivoConsulta: e.target.value })
                        }
                        isInvalid={
                            form.motivoConsulta?.length > 0 &&
                            (form.motivoConsulta.length < 3 ||
                                form.motivoConsulta.length > 150)
                        }
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        El motivo debe tener entre 3 y 150 caracteres.
                    </Form.Control.Feedback>

                    {!isUser ? (
                        <>
                            <h5>Estado</h5>
                            <select
                                value={form.estado}
                                onChange={e => setForm({ ...form, estado: e.target.value })}
                                className="form-select"
                                required
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Atendido">Atendido</option>
                                <option value="Reprogramado">Reprogramado</option>
                            </select>
                        </>
                    ) : (
                        <>
                            <h5>Método de Pago</h5>
                            <select
                                className="form-select"
                                value={form.metodoPago}
                                onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar método de pago</option>
                                <option value="tarjeta">Tarjeta de crédito/débito</option>
                                <option value="efectivo">Efectivo (Pagar en la clínica)</option>
                            </select>
                        </>
                    )}
                    {error && (
                        <div className="alert alert-danger py-2 my-2">
                            {error}
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        {isUser ? "Solicitar turno" : mode === "crear" ? "Crear" : "Guardar cambios"}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default CrearTurno;
