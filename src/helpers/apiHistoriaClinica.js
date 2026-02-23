const historiaBackend = import.meta.env.VITE_API_HISTORIA_CLINICA || "http://localhost:3001/historiaClinica";

const requestJSON = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const apiHistoriaDisponible = () => Boolean(historiaBackend);

export const obtenerHistoriaClinica = async () => {
  if (!historiaBackend) return null;

  const data = await requestJSON(historiaBackend);
  if (Array.isArray(data)) return data[0] ?? null;
  return data;
};

export const guardarHistoriaClinica = async (historia) => {
  if (!historiaBackend) return null;

  const hasId = Boolean(historia?.id);
  const url = hasId ? `${historiaBackend}/${historia.id}` : historiaBackend;
  const method = hasId ? "PUT" : "POST";

  return requestJSON(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(historia),
  });
};
