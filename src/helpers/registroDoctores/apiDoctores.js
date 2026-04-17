const doctoresBackend = import.meta.env.VITE_API_DOCTORES;

export const crearDoctor = async (doctor) => {
  const respuesta = await fetch(doctoresBackend, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctor),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || "Error al crear doctor");
    error.response = { data: datos }; 
    throw error;
  }
  
  return datos;
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

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const error = new Error(datos.mensaje || "Error al editar doctor");
    error.response = { data: datos };
    throw error;
  }
  
  return datos;
};

// Borrar
export const borrarDoctor = async (doctor) => {
  const respuesta = await fetch(`${doctoresBackend}/${doctor._id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json();
    const error = new Error(datos.mensaje || "Error al eliminar doctor");
    throw error;
  }
  
  return true;
};