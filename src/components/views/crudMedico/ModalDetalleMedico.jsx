import { Modal, Button } from 'react-bootstrap';

const ModalDetalleMedico = ({ show, handleClose, medico }) => {
    
    // Si medico es null o undefined, no mostramos nada
    if (!medico) {
        return null; 
    }

    // Aquí se muestran todos los datos que quieres ver
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Información Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Dr/a {medico.nombre_y_apellido}</h5>
                <hr />
                <p><strong>Email:</strong> {medico.email}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetalleMedico;