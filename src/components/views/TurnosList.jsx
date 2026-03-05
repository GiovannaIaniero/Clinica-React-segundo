import { useState } from 'react'
import { crearTurno, editarTurno, borrarTurno, cancelarTurno, obtenerTurnosPaginados } from "../../helpers/turnos/apiTurnos.js";
import { Button, Badge } from 'react-bootstrap'
import CrearTurno from '../turnos/CrearTurno.jsx';
import PaginacionTurnos from '../turnos/Paginacion.jsx';
import Table from 'react-bootstrap/Table'
import Swal from 'sweetalert2'
import { useEffect} from "react";
import { Link } from "react-router-dom";
import { getRoleFromToken } from '../../helpers/login/apiLogin.js';
import { obtenerNombreDesdeToken } from '../../helpers/login/apiLogin.js';
import Dropdown from 'react-bootstrap/Dropdown'

const TurnosList = () => {
    const [turnos, setTurnos] = useState([]);
    const [mode, setMode] = useState("crear")
    const [show, setShow] = useState(false)
    const [turnoEdit, setTurnoEdit] = useState(null)
    const [paginaActual, setPaginaActual] = useState(1);
    const [cantPaginas, setCantPaginas] = useState(1);
    const role = getRoleFromToken();
    const nombreUsuario = obtenerNombreDesdeToken();
    const isAdmin = role === "admin"
    const isUser = role === "paciente"
    const isMedico = role === "medico"

    const getNuevoEstado = () => {
        const role = getRoleFromToken();

        if (role === "medico") return "Cancelado por el médico";
        if (role === "paciente") return "Cancelado por el paciente";
        return "Cancelado";
    };

    const cambiarPagina = async (page) => {
        const data = await obtenerTurnosPaginados(page);

        setTurnos(data.turnos);
        setPaginaActual(data.paginaActual);
        setCantPaginas(data.cantPaginas);
    };

    const ordenarTurnos = (criterio) => {
        const ordenados = [...turnos].sort((a, b) => {
            switch (criterio) {
                case "fechaHora":
                    return new Date(`${a.fecha} ${a.hora}`) -
                        new Date(`${b.fecha} ${b.hora}`);

                case "nombre":
                    return a.pacienteNombre.localeCompare(b.pacienteNombre);

                case "estado":
                    return a.estado.localeCompare(b.estado);

                default:
                    return 0;
            }
        });

        setTurnos(ordenados);
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

            const getNuevoEstado = () => {
                const role = getRoleFromToken();
                console.log("Role en getNuevoEstado:", role);
                if (role === "medico") return "Cancelado por el médico";
                if (role === "paciente") return "Cancelado por el paciente";
                return "Cancelado";
            };

            const nuevoEstado = getNuevoEstado();

            const exito = await cancelarTurno(turno, nuevoEstado);

            if (exito) {

                const nuevosTurnos = turnos.map(t =>
                    t._id === turno._id
                        ? { ...t, estado: nuevoEstado }
                        : t
                );

                setTurnos(nuevosTurnos);

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
                    t._id === turno._id ? { ...t, estado: "Atendido" } : t
                );

                setTurnos(nuevosTurnos);

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

    const handleSave = async (nuevoTurno) => {
        try {
            if (mode === "crear") {
                const turnoGuardado = await crearTurno(nuevoTurno);

                setTurnos(prev => [...prev, turnoGuardado]);

                await Swal.fire({
                    icon: "success",
                    title: "Turno creado",
                    text: "El turno se creó correctamente",
                    confirmButtonColor: "#3085d6"
                });

                return turnoGuardado;
            }

            if (mode === "editar" && turnoEdit) {
                const turnoActualizado = await editarTurno({
                    ...nuevoTurno,
                    _id: turnoEdit._id
                });

                setTurnos(prev =>
                    prev.map(t =>
                        t._id === turnoEdit._id ? turnoActualizado : t
                    )
                );

                await Swal.fire({
                    icon: "success",
                    title: "Turno actualizado",
                    text: "Los cambios se guardaron correctamente",
                    confirmButtonColor: "#3085d6"
                });

                return turnoActualizado;
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un problema al guardar el turno"
            });

            console.error(error);
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
                onSave={handleSave}
                turnos={turnos}
            />


            {isUser && (
                <>
                    <Button
                        variant="success"
                        onClick={() => {
                            setMode("crear");
                            setTurnoEdit(null);
                            setShow(true);
                        }}
                    >
                        Pedir Turno
                        <i className="bi bi-calendar-plus me-2 ms-2"></i>
                    </Button>
                    <Button
                        as="a"
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=tomasignacioponce17@gmail.com"
                        variant="outline-secondary ms-2"
                        target="_blank"
                    >
                        Contactar soporte
                    </Button>
                </>
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
            {role === null ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div className="text-center p-5 shadow rounded bg-light" style={{ maxWidth: "500px" }}>

                        <i
                            className="bi bi-lock-fill warning mb-3"
                            style={{ fontSize: "3rem" }}
                        ></i>

                        <h3 className="fw-bold mb-3">
                            Acceso restringido
                        </h3>

                        <p className="text-muted mb-4">
                            Debe iniciar sesión para poder visualizar y gestionar sus turnos médicos.
                        </p>

                        <Button
                            variant="success"
                            className="fw-bold px-4"
                            as={Link}
                            to="/login"
                        >
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Ir a Iniciar Sesión
                        </Button>

                    </div>
                </div>

            ) : (
                <>
                    <div className="table-responsive">
                        <Dropdown className='mt-3'>
                            <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                Ordenar
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => ordenarTurnos("fechaHora")}>Ordenar por Fecha y Hora</Dropdown.Item>
                                <Dropdown.Item onClick={() => ordenarTurnos("nombre")}>Ordenar por Nombre</Dropdown.Item>
                                <Dropdown.Item onClick={() => ordenarTurnos("estado")}>Ordenar por Estado</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Table striped bordered hover size="sm" className='mt-3' responsive variant='white'>
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Médico</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Motivo de Consulta</th>
                                    <th>Estado</th>
                                    <th>Estado de Pago</th>
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
                                            <td>{t?.pacienteNombre}</td>
                                            <td>{t?.medicoNombre}</td>
                                            <td>
                                                {new Date(t.fecha).toLocaleDateString("es-AR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td>{t?.hora}</td>
                                            <td className="text-truncate" style={{ maxWidth: "300px" }}>
                                                {t.motivoConsulta}
                                            </td>
                                            <td>
                                                <Badge bg={
                                                    t.estado === "Atendido"
                                                        ? "success"
                                                        : t.estado.toLowerCase().includes("cancelado")
                                                            ? "danger"
                                                            : "warning"
                                                }>
                                                    {t.estado}
                                                </Badge>
                                            </td>

                                            <td>
                                                <Badge bg={t.estadoPago === "Pagado" ? "success" : "secondary"}>
                                                    {t.estadoPago}
                                                </Badge>
                                            </td>
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
                                                {(isMedico && t.medicoNombre === nombreUsuario) && (
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

                                                {(
                                                    (isUser && t.pacienteNombre === nombreUsuario) ||
                                                    (isMedico && t.medicoNombre === nombreUsuario)
                                                ) && (
                                                        <Button
                                                            variant="danger"
                                                            disabled={t.estado.toLowerCase().includes("cancelado")}
                                                            onClick={() => {
                                                                setMode(getNuevoEstado());
                                                                setTurnoEdit(t);
                                                                handleCancel(t);
                                                            }}
                                                        >
                                                            <i className="bi bi-x-circle-fill"></i>
                                                        </Button>
                                                    )}
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
                </>
            )}
        </div>
    )
}

export default TurnosList