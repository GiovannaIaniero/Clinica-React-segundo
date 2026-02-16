import { useState } from 'react'
import { crearTurno, editarTurno, borrarTurno, cancelarTurno, obtenerTurnosPaginados } from "../../helpers/turnos/apiTurnos.js";
import { Button } from 'react-bootstrap'
import CrearTurno from '../turnos/CrearTurno.jsx';
import PaginacionTurnos from '../turnos/Paginacion.jsx';
import Table from 'react-bootstrap/Table'
import Swal from 'sweetalert2'
import { useEffect } from "react";

const TurnosList = () => {
    const [turnos, setTurnos] = useState([]);
    const [mode, setMode] = useState("crear")
    const [show, setShow] = useState(false)
    const [turnoEdit, setTurnoEdit] = useState(null)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const [paginaActual, setPaginaActual] = useState(1);
    const [cantPaginas, setCantPaginas] = useState(1);
    const isAdmin = currentUser?.role === "admin"
    const isUser = currentUser?.role === "user"
    const isMedico = currentUser?.role === "medico"
    const isMyTurn = currentUser?.id === turnoEdit?.pacienteId


    const pacientes = [
        { id: 1, nombre: "Juan Perez" },
        { id: 2, nombre: "Maria Gomez" },
        { id: 3, nombre: "Carlos Lopez" }
    ];


    const medicos = [
        { id: 1, nombre: "Dr. Smith" },
        { id: 2, nombre: "Dra. Johnson" },
        { id: 3, nombre: "Dr. Brown" }
    ];

    const getNuevoEstado = () => {
        if (currentUser?.role === "medico") return "Cancelado por el médico";
        if (currentUser?.role === "user") return "Cancelado por el paciente";
        return "Cancelado";
    };

    const cambiarPagina = async (page) => {
        const data = await obtenerTurnosPaginados(page);

        setTurnos(data.turnos);
        setPaginaActual(data.paginaActual);
        setCantPaginas(data.cantPaginas);
    };


    useEffect(() => {
        const fetchTurnos = async () => {
            const data = await obtenerTurnosPaginados(1);

            setTurnos(data.turnos);
            setPaginaActual(data.paginaActual);
            setCantPaginas(data.cantPaginas);
        };

        fetchTurnos();
    }, []);


    const handleDelete = async (turno) => {
        console.log("Turno a borrar:", turno);

        const result = await Swal.fire({
            title: "¿Eliminar turno?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            const exito = await borrarTurno(turno);
            if (exito) {

                const nuevosTurnos = turnos.filter(t => t._id !== turno._id);
                setTurnos(nuevosTurnos);
                localStorage.setItem("turnos", JSON.stringify(nuevosTurnos));

                Swal.fire({
                    title: "Eliminado",
                    text: "El turno ha sido eliminado",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo eliminar el turno",
                    icon: "error"
                });
            }
        }
    };

    const handleCancel = async (turno) => {
        const result = await Swal.fire({
            title: " ¿Deseas cancelar el turno?",
            text: "Si quieres deshacer esta accion, contacta con la clínica.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "Volver atrás"
        });

        if (result.isConfirmed) {
            const exito = await cancelarTurno(turno, getNuevoEstado());
            if (exito) {

                const getNuevoEstado = () => {
                    if (currentUser?.role === "medico") return "Cancelado por el médico";
                    if (currentUser?.role === "user") return "Cancelado por el paciente";
                    return "Cancelado";
                };

                const nuevosTurnos = turnos.map(t =>
                    t.id === turno.id ? { ...t, estado: getNuevoEstado() } : t
                );

                setTurnos(nuevosTurnos);
                localStorage.setItem("turnos", JSON.stringify(nuevosTurnos));



                Swal.fire({
                    title: "Cancelado",
                    text: "El turno ha sido cancelado",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo cancelar el turno",
                    icon: "error"
                });
            }
        }
    };

    const handleSuccess = async (turno) => {
        const result = await Swal.fire({
            title: " ¿Deseas marcar el turno como atendido?",
            text: "Si quieres deshacer esta accion, contacta con la clínica.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, marcar como atendido",
            cancelButtonText: "Volver atrás"
        });

        if (result.isConfirmed) {
            const exito = await cancelarTurno(turno, "Atendido");
            if (exito) {

                const nuevosTurnos = turnos.map(t =>
                    t.id === turno.id ? { ...t, estado: "Atendido" } : t
                );

                setTurnos(nuevosTurnos);
                localStorage.setItem("turnos", JSON.stringify(nuevosTurnos));



                Swal.fire({
                    title: "Atendido",
                    text: "El turno ha sido marcado como atendido",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo marcar el turno como atendido",
                    icon: "error"
                });
            }
        }
    };

    return (
        <div>
            <h1>Turnos</h1>
            <CrearTurno
                show={show}
                onClose={() => setShow(false)}
                mode={mode}
                turnoEdit={turnoEdit}
                onSave={async (nuevoTurno) => {

                    if (mode === "crear") {
                        const turnoGuardado = await crearTurno(nuevoTurno);
                        setTurnos([...turnos, turnoGuardado]);
                        console.log("Turno creado:", turnoGuardado)
                        return true;

                    } else if (mode === "editar" && turnoEdit) {
                        const turnoActualizado = await editarTurno({
                            ...nuevoTurno,
                            _id: turnoEdit._id
                        });
                        setTurnos(prev =>
                            prev.map(t =>
                                t._id === turnoEdit._id ? turnoActualizado : t
                            )
                        );
                        console.log("Turno actualizado:", turnoActualizado);
                        return true
                    }
                }}
                pacientesMock={pacientes}
                medicosMock={medicos}
                turnos={turnos}
            />
            {isUser && (
                <Button
                    as="a"
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=tomasignacioponce17@gmail.com"
                    variant="outline-secondary"
                    target="_blank"
                >
                    Contactar soporte
                </Button>
            )}

            {isAdmin && (
                <Button
                    variant="primary"
                    onClick={() => {
                        setMode("crear");
                        setTurnoEdit(null);
                        setShow(true);
                    }}
                >
                    Nuevo Turno
                    <i className="bi bi-plus-circle me-2 ms-2"></i>
                </Button>
            )}

            {isMedico && (
                <Button
                    as="a"
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=tomasignacioponce17@gmail.com"
                    variant="outline-secondary"
                    target="_blank"
                >
                    Contactar soporte
                </Button>
            )}


            <div className="table-responsive">
                <Table striped bordered hover size="sm" className='mt-3' responsive>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Médico</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Motivo de Consulta</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">No hay turnos disponibles</td>
                            </tr>
                        ) : (
                            turnos.map(t => (
                                <tr key={t.id}>
                                    <td>{t.pacienteNombre}</td>
                                    <td>{t.medicoNombre}</td>
                                    <td>{t.fecha}</td>
                                    <td>{t.hora}</td>
                                    <td>{t.motivoConsulta}</td>
                                    <td>{t.estado}</td>
                                    <td>
                                        {isAdmin && (
                                            <>
                                                <Button
                                                    variant="dark"
                                                    className="me-2"
                                                    onClick={() => {
                                                        setMode("editar");
                                                        setTurnoEdit(t);
                                                        setShow(true);
                                                    }}
                                                >
                                                    <i className="bi bi-pen-fill"></i>
                                                </Button>

                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        setMode("eliminar");
                                                        setTurnoEdit(t);
                                                        handleDelete(t);
                                                    }}
                                                >
                                                    <i className="bi bi-person-x"></i>
                                                </Button>
                                            </>
                                        )}
                                        {isMedico && (
                                            <Button
                                                variant="success"
                                                className='me-2'
                                                disabled={t.estado === "Atendido"}
                                                onClick={() => {
                                                    setMode("atendido");
                                                    setTurnoEdit(t);
                                                    handleSuccess(t);
                                                }}
                                            >
                                                <i className="bi bi-check-all"></i>
                                            </Button>
                                        )}
                                        {(isUser && isMyTurn) || isMedico ? (
                                            <Button
                                                variant="danger"
                                                disabled={t.estado === getNuevoEstado()}
                                                onClick={() => {
                                                    setMode(getNuevoEstado());
                                                    setTurnoEdit(t);
                                                    handleCancel(t);
                                                }}
                                            >
                                                <i className="bi bi-x-circle-fill"></i>
                                            </Button>
                                        ) : null}

                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
            <PaginacionTurnos
                paginaActual={paginaActual}
                cantPaginas={cantPaginas}
                onPageChange={cambiarPagina}
            />
        </div>
    )
}

export default TurnosList