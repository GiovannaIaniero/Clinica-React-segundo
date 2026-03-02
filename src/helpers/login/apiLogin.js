const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";
const loginBackend = import.meta.env.VITE_API_LOGIN || `${apiBase}/login`;
const adminUser = import.meta.env.VITE_ADMIN_USER || "admin@gmail.com";
const adminPass = import.meta.env.VITE_ADMIN_PASS || "123456";

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

const crearTokenLocal = (payload) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.firma-local`;
};

const loginFallbackLocal = (email, contrase\u00f1a) => {
  if (email === adminUser && contrase\u00f1a === adminPass) {
    return {
      token: crearTokenLocal({ role: "admin", email }),
      user: { role: "admin", email },
      source: "fallback-local",
    };
  }

  const medicos = JSON.parse(localStorage.getItem("agendaMedicoKey")) || [];
  const medico = medicos.find(
    (m) => m?.email === email && m?.contrase\u00f1a === contrase\u00f1a
  );
  if (medico) {
    return {
      token: crearTokenLocal({ role: "medico", email: medico.email }),
      user: { role: "medico", email: medico.email },
      source: "fallback-local",
    };
  }

  const pacientes = JSON.parse(localStorage.getItem("pacientesKey")) || [];
  const paciente = pacientes.find(
    (p) => p?.email === email && p?.contrase\u00f1a === contrase\u00f1a
  );
  if (paciente) {
    return {
      token: crearTokenLocal({ role: "paciente", email: paciente.email }),
      user: { role: "paciente", email: paciente.email },
      source: "fallback-local",
    };
  }

  return null;
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
        throw new Error(data?.mensaje || raw || "Error al iniciar sesi\u00f3n");
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

  const local = loginFallbackLocal(email, contrase\u00f1a);
  if (local) return local;

  return { error: "Credenciales inv\u00e1lidas" };
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

