const loginBackend = import.meta.env.VITE_API_LOGIN

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
};

const decodeTokenPayload = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    return JSON.parse(decodeBase64Url(parts[1]));
  } catch {
    return null;
  }
};

export const login = async (email, contrase\u00f1a) => {
  if (loginBackend) {
    try {
      const respuesta = await fetch(loginBackend, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrase\u00f1a }),
      });

      const raw = await respuesta.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!respuesta.ok) {
        throw new Error(data?.mensaje || raw );
      }

      if (data?.token) return data;
      if (data?.user?.role) {
        return {
          ...data,
          token: crearTokenLocal({ role: data.user.role, email }),
        };
      }
    } catch (error) {
      console.warn("Login por API no disponible, usando fallback local.", error);
    }
  }

  return { error: " - Credenciales inv\u00e1lidas" };
};

export const getRoleFromToken = () => {
  const payload = decodeTokenPayload(localStorage.getItem("token"));
  return payload?.role || null;
};

export const obtenerNombreDesdeToken = () => {
  const payload = decodeTokenPayload(localStorage.getItem("token"));
  return payload?.nombre_y_apellido || null;
};

export const getUserIdFromToken = () => {
  const payload = decodeTokenPayload(localStorage.getItem("token"));
  return payload?.id || null;
};

