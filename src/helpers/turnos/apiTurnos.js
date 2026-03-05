const turnosBackend = import.meta.env.VITE_API_TURNOS;

export const crearTurno = async (turno) => {
  try {
    const respuesta = await fetch(turnosBackend, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turno),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      // 👇 devolvemos los errores reales del backend
      throw data;
    }

    return data
  } catch (error) {
    throw error;
  }
};

export const editarTurno = async (turno) => {
  try {
    const respuesta = await fetch(`${turnosBackend}/${turno._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(turno),
    });

    if (!respuesta.ok) {
      throw new Error("Error al editar turno");
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error:", error);
    twoError(error);
  }
};

export const borrarTurno = async (turno) => {
  try {

    const respuesta = await fetch(`${turnosBackend}/${turno._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!respuesta.ok) {
      throw new Error("Error al borrar turno");
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const cancelarTurno = async (turno, estado) => {
  try {
    const respuesta = await fetch(`${turnosBackend}/${turno._id}/cancelar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ estado })
    });

    if (!respuesta.ok) throw new Error("Error al cancelar turno");
    return await respuesta.json();

  } catch (error) {
    console.error("Error:", error);
  }
};

export const obtenerTurnos = async () => {
  try {
    const respuesta = await fetch(turnosBackend);

    if (!respuesta.ok) {
      throw new Error("Error al obtener turnos");
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export const obtenerTurnosPaginados = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("token"); // 👈 FALTABA ESTO
    const respuesta = await fetch(`${turnosBackend}/paginacion?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!respuesta.ok) {
      throw new Error("Error al obtener turnos paginados");
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error:", error);
    return {
      turnos: [],
      paginaActual: 1,
      cantPaginas: 1,
      cantidadTurnos: 0,
    };
  }
};