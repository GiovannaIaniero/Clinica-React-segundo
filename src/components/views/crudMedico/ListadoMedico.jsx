import ItemMedico from './ItemMedico';
import {getRoleFromToken} from '../../../helpers/login/apiLogin';

const ListadoMedico = ({ medicos, borrarMedico, modificarMedico, verDetalleMedico }) => {

  const role = getRoleFromToken();

  return (
    <>
    { role === "admin" && (
      <div className="container mt-5">
        <div className="row g-3">
          {
            medicos.map((medico) => (
              <ItemMedico
                key={medico._id}
                medico={medico}
                borrarMedico={borrarMedico}
                modificarMedico={modificarMedico}
                verDetalleMedico={verDetalleMedico}
              />
            ))
          }
        </div>
      </div>
    )}
    </>
  )
}

export default ListadoMedico;