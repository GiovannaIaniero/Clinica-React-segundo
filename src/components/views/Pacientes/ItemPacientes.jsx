import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';

const ItemPacientes = ({ paciente, borrarPaciente, modificarPaciente, verDetallePaciente }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <Card className="shadow-lg patient-card col-md-12">
        <Card.Img
          variant="top"
          className="patient-card-img w-100 h-100"
          src="https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg?semt=ais_hybrid&w=740&q=80"
        />
        <Card.Body>
          <Card.Title>Paciente: {paciente.nombre_y_apellido}</Card.Title>

          <Card.Text><strong>Obra Social:</strong> {paciente.obraSocial}</Card.Text>
          <Card.Text><strong>Celular:</strong> {paciente.celular}</Card.Text>
          <Card.Text><strong>Email:</strong> {paciente.email}</Card.Text>

          <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
            <Button
              variant="info"
              onClick={() => verDetallePaciente(paciente)}
            >
              <FaEye />
            </Button>
            <Button
              variant="warning"
              onClick={() => modificarPaciente(paciente._id)}
            >
              <FaPencilAlt />
            </Button>
            <Button
              variant="danger"
              onClick={() => borrarPaciente(paciente._id)}
            >
              <FaTrash />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ItemPacientes;