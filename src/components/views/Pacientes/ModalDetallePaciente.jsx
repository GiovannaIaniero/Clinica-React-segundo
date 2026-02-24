import { Modal, Button } from 'react-bootstrap';

const ModalDetallePaciente = ({ show, handleClose, paciente }) => {
    
    if (!paciente) {
        return null; 
    }

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
                <p><strong>Contraseña:</strong> ***********</p>
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