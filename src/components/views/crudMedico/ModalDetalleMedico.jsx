import { Modal, Button } from 'react-bootstrap';
import { getRoleFromToken } from '../../../helpers/login/apiLogin';

const ModalDetalleMedico = ({ show, handleClose, medico }) => {

    if (!medico) {
        return null;
    }

    const role = getRoleFromToken();

    return (
        <>
            {role === "admin" && (
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Información Usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Dr/a {medico?.nombre_y_apellido}</h5>
                        <hr />
                        <p><strong>Email:</strong> {medico?.email}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default ModalDetalleMedico;