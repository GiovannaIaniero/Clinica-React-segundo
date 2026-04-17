import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';

const ItemMedico = ({ medico, borrarMedico, modificarMedico, verDetalleMedico }) => {

  return (
    <div className="col-12 col-sm-6 col-md-3 mb-4">
      <Card className="shadow-lg patient-card col-md-12 h-100">
        <Card.Img
          variant="top"
          src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
        />
        <Card.Body>
          
          <Card.Title>Dr/a {medico.nombre_medico} {medico.apellido_medico}</Card.Title>

          <Card.Text className='mt-4'>
            Especialidad: {medico.especialidad}
          </Card.Text>

          <Card.Text>
            Email: {medico.email_medico}
          </Card.Text>

          <div className='d-flex justify-content-center align-items-center gap-2'>
            <Button variant="primary" onClick={() => verDetalleMedico(medico)}>
              <FaEye />
            </Button>

            <Button variant="warning" onClick={() => modificarMedico(medico._id)}>
              <FaPencilAlt />
            </Button>

            <Button variant="danger" onClick={() => borrarMedico(medico)}>
              <FaTrash />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ItemMedico;