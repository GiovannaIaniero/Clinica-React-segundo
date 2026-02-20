import { useEffect, useState } from "react";
import FormGuardia from "./FormGuardia";
import ListaDeGuardias from "./ListaDeGuardias";
import Swal from "sweetalert2";

function GuardiaMedica() {
  const [indiceEditando, setIndiceEditando] = useState(null);

  const [medicos, setMedicos] = useState(() => {
    const data = localStorage.getItem("medicos");

    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("medicos", JSON.stringify(medicos));
  }, [medicos]);

  const agregarMedico = (medico) => {
    setMedicos([...medicos, medico]);
  };

  const borrarMedico = (index) => {
    Swal.fire({
      title: "¿Eliminar guardia?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevosMedicos = medicos.filter((_, i) => i !== index);
        setMedicos(nuevosMedicos);

        Swal.fire({
          title: "Eliminado",
          text: "La guardia médica fue eliminada.",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    });
  };
  const seleccionarMedicoParaEditar = (index) => {
    setIndiceEditando(index);
  };

  const editarMedico = (medicoActualizado) => {
    const copia = [...medicos];
    copia[indiceEditando] = medicoActualizado;
    setMedicos(copia);
    setIndiceEditando(null);
  };

  return (
    <div>
      <FormGuardia
        agregarMedico={agregarMedico}
        editarMedico={editarMedico}
        medicoEditando={
          indiceEditando !== null ? medicos[indiceEditando] : null
        }
      />

      <ListaDeGuardias
        medicos={medicos}
        borrarMedico={borrarMedico}
        seleccionarMedicoParaEditar={seleccionarMedicoParaEditar}
        indiceEditando={indiceEditando}
      />
    </div>
  );
}

export default GuardiaMedica;
