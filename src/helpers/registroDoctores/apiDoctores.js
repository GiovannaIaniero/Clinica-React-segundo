
const doctoresBackend = import.meta.env.VITE_API_DOCTORES;

// Crear
export const crearDoctor = async (doctor) => {
  const respuesta = await fetch(doctoresBackend, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctor),
  });

  if (!respuesta.ok) throw new Error("Error al crear doctor");
  return await respuesta.json();
};

// Listar
export const listarDoctores = async () => {
  const respuesta = await fetch(doctoresBackend);
  if (!respuesta.ok) throw new Error("Error al listar doctores");
  return await respuesta.json();
};

// Editar
export const editarDoctor = async (doctor) => {
  const respuesta = await fetch(`${doctoresBackend}/${doctor._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctor),
  });

  if (!respuesta.ok) throw new Error("Error al editar doctor");
  return await respuesta.json();
};

// Borrar
export const borrarDoctor = async (doctor) => {
  const respuesta = await fetch(`${doctoresBackend}/${doctor._id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) throw new Error("Error al eliminar doctor");
  return true;
};


