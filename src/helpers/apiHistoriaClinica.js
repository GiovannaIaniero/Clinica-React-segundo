import { obtenerNombreDesdeToken } from "./login/apiLogin.js";

const apiBase = import.meta.env.VITE_API_BASE;
const historialBackend =
  import.meta.env.VITE_API_HISTORIA_CLINICA || `${apiBase}/historial`;
const pacienteIdEnv = import.meta.env.VITE_HISTORIAL_PACIENTE_ID;

const requestJSON = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

const getPacienteId = () => obtenerNombreDesdeToken() || pacienteIdEnv;

const toBackendPayload = (historia = {}) => {
  const consultas = Array.isArray(historia.consultas) ? historia.consultas : [];
  const ultimaConsulta = consultas[consultas.length - 1] || {};

  return {
    pacienteId: getPacienteId(),
    fecha: ultimaConsulta.fecha || new Date().toISOString(),
    motivo: ultimaConsulta.motivo || historia.antecedentes || "Consulta general",
    indicaciones:
      ultimaConsulta.indicaciones || historia.medicacionHabitual || "Sin indicaciones",
    profesional: historia.nombre || "Profesional",
    nombre: historia.nombre || "",
    obraSocial: historia.obraSocial || "",
    nroAfiliado: historia.nroAfiliado || "",
    antecedentes: historia.antecedentes || "",
    alergias: historia.alergias || "",
    medicacionHabitual: historia.medicacionHabitual || "",
    consultas,
  };
};

export const apiHistoriaDisponible = () => Boolean(historialBackend && getPacienteId());

export const obtenerHistoriaClinica = async () => {
  const pacienteId = getPacienteId();
  if (!historialBackend || !pacienteId) return null;

  const data = await requestJSON(`${historialBackend}/paciente/${pacienteId}`);
  if (Array.isArray(data)) return data[0] ?? null;
  return data;
};

export const guardarHistoriaClinica = async (historia) => {
  const pacienteId = getPacienteId();
  if (!historialBackend || !pacienteId) {
    throw new Error("Falta pacienteId para guardar historia clínica");
  }

  const hasId = Boolean(historia?.id || historia?._id);
  const id = historia?.id || historia?._id;
  const url = hasId ? `${historialBackend}/${id}` : historialBackend;
  const method = hasId ? "PUT" : "POST";

  return requestJSON(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(toBackendPayload(historia)),
  });
};

