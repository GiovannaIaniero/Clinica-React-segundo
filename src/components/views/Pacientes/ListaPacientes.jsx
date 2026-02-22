import ItemPacientes from './ItemPacientes';

const ListaPacientes = ({ pacientes, borrarPaciente, modificarPaciente, verDetallePaciente }) => {
  return (
    <div className="container mt-4">
      <div className="row g-3">
        {pacientes.map((paciente) => (
          <ItemPacientes
            key={paciente._id} // ✅ usamos _id como key
            paciente={paciente}
            borrarPaciente={borrarPaciente}
            modificarPaciente={modificarPaciente}
            verDetallePaciente={verDetallePaciente}
          />
        ))}
      </div>
    </div>
  );
};

export default ListaPacientes;