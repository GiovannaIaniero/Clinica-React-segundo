import { Modal, Button } from 'react-bootstrap';

const ModalDetallePaciente = ({ show, handleClose, paciente }) => {
    
    // Si paciente es null o undefined, no mostramos nada
    if (!paciente) {
        return null; 
    }

    // Aquí se muestran todos los datos que quieres ver
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Información Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Paciente: {paciente.nombre_y_apellido}</h5>
                <hr />
                <p><strong>Obra Social:</strong> {paciente.obraSocial}</p>
                <p><strong>Email:</strong> {paciente.email}</p>
                <p><strong>Contraseña:</strong> {paciente.contraseña}</p>
                {/* Puedes añadir aquí más propiedades si las tienes: 
                <p><strong>Matrícula:</strong> {paciente.matricula}</p> 
                */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetallePaciente;