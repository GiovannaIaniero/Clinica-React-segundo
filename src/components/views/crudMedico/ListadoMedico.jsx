import ItemMedico from './ItemMedico';

const ListadoMedico = ({medicos, borrarMedico, modificarMedico, verDetalleMedico}) => {
  return (
    <div className="container mt-5">
        <div className="row g-3">
        {
            medicos.map((medico, index) => <ItemMedico key={index} medico={medico} borrarMedico={borrarMedico} modificarMedico={modificarMedico} verDetalleMedico={verDetalleMedico} /> )
        }
    </div>
    </div>
  )
}

export default ListadoMedico
