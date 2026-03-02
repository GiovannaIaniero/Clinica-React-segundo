import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';

const ItemMedico = ({ medico, borrarMedico, modificarMedico, verDetalleMedico }) => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const isAdmin = currentUser?.role === "admin"
  const isMedico = currentUser?.role === "medico"

  return (
    <div className="col-12 col-sm-6 col-md-3 mb-4">

      <Card className="shadow-lg patient-card col-md-12 h-100">
        <Card.Img
          variant="top"
          src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
        />
        <Card.Body>
          <Card.Title>Dr/a {medico.nombre_y_apellido}</Card.Title>

          <Card.Text>
            Email: {medico.email}
          </Card.Text>

          <div className='d-flex justify-content-center align-item-center gap-2'>
            <Button
              variant="primary"
              onClick={() => verDetalleMedico(medico)}
            >
              <FaEye/>
            </Button>

            <Button
              variant="warning"
              onClick={() => modificarMedico(medico._id)}
            >
              <FaPencilAlt/>
            </Button>

            <Button
              variant="danger"
              onClick={() => borrarMedico(medico)}
            >
              <FaTrash/>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {isAdmin ? (
        <Card className="shadow-lg patient-card col-md-12">
          <Card.Img
            variant="top"
            src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSuEBa1zuFIvWpp5uaXrimbkTCnDJ2lbzz7tQBdZvFabvT4xLC2ikF9y7qvhdoijiWKdXlqQzVThT6sqxlhJBkxvjFpa3e2qksd_FK1TMu_ONvju_o"
          />
          <Card.Body>
            <Card.Title>Dr/a {medico.nombre_y_apellido}</Card.Title>

            <Card.Text className='mt-4'>
              Especialidad: {medico.especialidad}
            </Card.Text>

            <Card.Text>
              Email: {medico.email}
            </Card.Text>

            <div className='d-flex justify-content-center align-item-center gap-2'>
              <Button
                variant="primary"
                onClick={() => verDetalleMedico(medico)}
              >
                <FaEye />
              </Button>

              <Button
                variant="warning"
                onClick={() => modificarMedico(medico._id)}
              >
                <FaPencilAlt />
              </Button>

              <Button
                variant="danger"
                onClick={() => borrarMedico(medico)}
              >
                <FaTrash />
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : null}

    </div>
  )
}

export default ItemMedico