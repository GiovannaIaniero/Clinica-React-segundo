import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { validarTurnoCompleto } from '../../helpers/turnos/ValidacionesTurnos';
import { useNavigate } from "react-router-dom";
import { getRoleFromToken } from '../../helpers/login/apiLogin.js';
import { listarDoctores } from '../../helpers/registroDoctores/apiDoctores.js';
import { listarPacientes } from '../../helpers/pacientes/apiPacientes.js';

const CrearTurno = ({
    show,
    onClose,
    onSave,
    mode,
    turnoEdit,
    turnos,
}) => {

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [medicos, setMedicos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const role = getRoleFromToken();
    const isUser = role === "paciente"

    useEffect(() => {

        const cargarMedicos = async () => {
            try {
                const data = await listarDoctores();

                const medicosFormateados = data.filter(m => m.role !== "admin").map(m => ({
                    id: m._id,
                    nombre: m.nombre_y_apellido
                }));

                setMedicos(medicosFormateados);

            } catch (error) {
                console.error(error);
            }
        };

        cargarMedicos();

        const cargarPacientes = async () => {
            try {
                const data = await listarPacientes();

                const pacientesFormateados = data.filter(p => p.role !== "admin").map(p => ({
                    id: p._id,
                    nombre: p.nombre_y_apellido
                }));

                setPacientes(pacientesFormateados);

            } catch (error) {
                console.error(error);
            }
        };

        cargarPacientes();

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

        if (!form.hora) {
            setError("Debe seleccionar una hora para el turno.");
            return;
        }

        setError("");

        if (isUser && form.metodoPago === "tarjeta") {
            navigate("/pago", {
                state: form
            });
            return;
        }

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

    const generarHorarios = () => {
        const horarios = [];
        const inicio = 8;
        const fin = 18;

        for (let h = inicio; h < fin; h++) {
            horarios.push(`${h.toString().padStart(2, "0")}:00`);
            horarios.push(`${h.toString().padStart(2, "0")}:30`);
        }

        return horarios;
    };

    const horarios = generarHorarios();

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
                    <h5 className='mt-3'>Paciente</h5>
                    {!isUser ? (
                        <select
                            value={form.pacienteNombre}
                            onChange={e => setForm({ ...form, pacienteNombre: e.target.value })}
                            className='form-select'
                            required
                        >
                            <option value="">Seleccionar paciente</option>
                            {pacientes.map(p => (
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

                    <h5 className='mt-3'>Médico</h5>
                    <select
                        value={form.medicoNombre}
                        onChange={e => setForm({ ...form, medicoNombre: e.target.value })}
                        className='form-select'
                        required
                    >
                        <option value="">Seleccionar médico</option>
                        {medicos.map(m => (
                            <option key={m.id} value={m.nombre}>
                                {m.nombre}
                            </option>
                        ))}
                    </select>

                    <h5 className='mt-3'>Fecha</h5>
                    <Form.Control
                        type="date"
                        value={form.fecha}
                        min={today}
                        onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                        required
                    />

                    <h5 className='mt-3'>Hora</h5>
                    <div className="d-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                        {horarios.map((hora) => (
                            <button
                                type="button"
                                key={hora}
                                className={`btn ${form.hora === hora ? "btn-primary" : "btn-outline-primary"
                                    }`}
                                onClick={() => setForm({ ...form, hora })}
                            >
                                {hora}
                            </button>
                        ))}
                    </div>

                    <h5 className='mt-3'>Motivo de Consulta</h5>
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
                            <h5 className='mt-3' >Estado</h5>
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
                            <h5 className='mt-3'>Método de Pago</h5>
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
