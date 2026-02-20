const loginBackend = import.meta.env.VITE_API_LOGIN;

export const login = async (email, contraseña) => {
  try {
    const respuesta = await fetch(loginBackend, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contraseña }),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.mensaje || "Error al iniciar sesión");
    }
    console.log(data);
    
    return data // data.token, data.user, etc.
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};