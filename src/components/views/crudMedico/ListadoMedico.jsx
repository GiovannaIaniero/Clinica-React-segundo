import ItemMedico from './ItemMedico';

const ListadoMedico = ({medicos, borrarMedico, modificarMedico, verDetalleMedico}) => {
  return (
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
  )
}

export default ListadoMedico;