const pacientesBackend = import.meta.env.VITE_API_PACIENTES;

export const obtenerPacientes = async () => {
  const res = await fetch(pacientesBackend);
  return await res.json();
};

export const crearPaciente = async (paciente) => {

  const pacienteEnviar = {
    ...paciente,
    confirmarContraseña: paciente.contraseña_confirmar
  };

  const res = await fetch(pacientesBackend, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pacienteEnviar)
  });

  return res.ok;
};

export const editarPaciente = async (paciente) => {

  const pacienteEnviar = {
    ...paciente,
    confirmarContraseña: paciente.contraseña_confirmar
  };

  const res = await fetch(`${pacientesBackend}/${paciente._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(pacienteEnviar),
  });

  return res.ok;
};

export const borrarPaciente = async (id) => {
  const res = await fetch(`${pacientesBackend}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.ok;
};

export const listarPacientes = async () => {
  const respuesta = await fetch(pacientesBackend);
  if (!respuesta.ok) throw new Error("Error al listar pacientes");
  return await respuesta.json();
};