import { Table, Alert } from "react-bootstrap";

const safeText = (value) => {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || "-";
};

function ListaEvoluciones({ consultas }) {
  if (!Array.isArray(consultas) || consultas.length === 0) {
    return (
      <Alert variant="info" className="mb-0">
        No hay consultas registradas.
      </Alert>
    );
  }

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Motivo de consulta</th>
          <th>Diagnóstico</th>
          <th>Indicaciones</th>
        </tr>
      </thead>
      <tbody>
        {consultas.map((c, index) => (
          <tr key={`${c?.fecha || "sin-fecha"}-${index}`}>
            <td>{safeText(c?.fecha)}</td>
            <td>{safeText(c?.motivo)}</td>
            <td>{safeText(c?.diagnostico)}</td>
            <td>{safeText(c?.indicaciones)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ListaEvoluciones;
