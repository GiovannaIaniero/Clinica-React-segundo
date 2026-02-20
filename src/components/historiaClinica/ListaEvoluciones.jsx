import { Table, Alert } from "react-bootstrap";

function ListaEvoluciones({ consultas }) {
  if (!consultas || consultas.length === 0) {
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
          <tr key={index}>
            <td>{c.fecha}</td>
            <td>{c.motivo}</td>
            <td>{c.diagnostico}</td>
            <td>{c.indicaciones}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ListaEvoluciones;
