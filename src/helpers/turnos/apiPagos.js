const pagosBackend = import.meta.env.VITE_API_PAGOS;

export const iniciarPagoTurno = async (payload) => {
  try {
    if (!pagosBackend) {
      throw new Error("Falta VITE_API_PAGOS en .env");
    }

    const respuesta = await fetch(pagosBackend, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!respuesta.ok) {
      throw new Error("Error al iniciar pago");
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};


