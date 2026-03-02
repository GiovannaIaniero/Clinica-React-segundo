import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { iniciarPagoTurno } from "../../helpers/turnos/apiPagos.js";
import { crearTurno } from "../../helpers/turnos/apiTurnos.js";

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const datosTurno = location.state;

  const [loading, setLoading] = useState(false);

  if (!datosTurno) {
    return (
      <div className="container mt-4">
        <h4>No hay información del turno</h4>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver
        </button>
      </div>
    );
  }

  const handleConfirmarPago = async () => {
    try {
      setLoading(true);

      if (datosTurno.metodoPago === "efectivo") {
        const response = await crearTurno(datosTurno);

        if (!response.ok) throw new Error("Error al crear turno");

        alert("Turno creado correctamente. Pago pendiente en clínica.");
        navigate("/"); 
      }

      if (datosTurno.metodoPago === "tarjeta") {
        const response = await iniciarPagoTurno(datosTurno);

        if (response?.init_point) {
          window.open(response.init_point, "_blank");
          navigate("/"); 
        } else {
          throw new Error("Error al iniciar pago");
        }
      }

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error procesando el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Confirmar Turno</h2>

      <div className="card p-3 mt-3">
        <h5>Resumen del Turno</h5>

        <p><strong>Paciente:</strong> {datosTurno.pacienteNombre}</p>
        <p><strong>Médico:</strong> {datosTurno.medicoNombre}</p>
        <p><strong>Fecha:</strong> {datosTurno.fecha}</p>
        <p><strong>Hora:</strong> {datosTurno.hora}</p>
        <p><strong>Motivo:</strong> {datosTurno.motivoConsulta}</p>
        <p><strong>Precio:</strong> ${datosTurno.precio}</p>
        <p><strong>Método de pago:</strong> {datosTurno.metodoPago}</p>

        <button
          className="btn btn-success mt-3"
          onClick={handleConfirmarPago}
          disabled={loading}

        >
          {loading ? "Procesando..." : "Confirmar y Pagar"}
        </button>
      </div>
    </div>
  );
};

export default Pago;
