import { getRoleFromToken } from '../../../helpers/login/apiLogin';
import ItemPacientes from './ItemPacientes';

const ListaPacientes = ({ pacientes, borrarPaciente, modificarPaciente, verDetallePaciente }) => {

  const role = getRoleFromToken()

  return (

    <>
      {role === 'admin' && (
        <div className="container mt-4">
          <div className="row g-3">
            {pacientes
              .filter((paciente) => paciente.role !== "admin")
              .map((paciente) => (
                <ItemPacientes
                  key={paciente._id}
                  paciente={paciente}
                  borrarPaciente={borrarPaciente}
                  modificarPaciente={modificarPaciente}
                  verDetallePaciente={verDetallePaciente}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ListaPacientes;