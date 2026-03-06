const validarTurnoDuplicado = (turnos, nuevoTurno, turnoEdit) => {
  return turnos.some(turno => {
    const mismoMedico = turno.medico === nuevoTurno.medico;
    const mismaFecha = turno.fecha === nuevoTurno.fecha;
    const mismaHora = turno.hora === nuevoTurno.hora;

    const noEsElMismoTurnoEditado =
      !turnoEdit || turno._id !== turnoEdit._id;

    return mismoMedico && mismaFecha && mismaHora && noEsElMismoTurnoEditado;
  });
};

export const validarFinDeSemana = (fecha) => {
  const dia = new Date(fecha).getDay();
  return dia === 5 || dia === 6;
};

export const validarLimiteTiempo = (fecha, diasLimite = 30) => {
  const limite = new Date()
  limite.setDate(limite.getDate() + diasLimite);

  const fechaSeleccionada = new Date(fecha);

  return fechaSeleccionada > limite;
}

export const horarioLaboral = (
  fecha,
  hora,
  horaInicio = "08:00",
  horaFinal = "18:00",
  duracionMinutos = 30
) => {

  const inicioTurno = new Date(`${fecha}T${hora}`);
  const finTurno = new Date(inicioTurno.getTime() + duracionMinutos * 60000);

  const inicioLaboral = new Date(`${fecha}T${horaInicio}`);
  const finLaboral = new Date(`${fecha}T${horaFinal}`);

  return inicioTurno < inicioLaboral || finTurno > finLaboral;
};

export const validarSuperposicion = (
  turnos,
  nuevoTurno,
  turnoEdit = null,
  duracionMinutos = 30,
) => {

  const nuevaFechaHoraInicio = new Date(`${nuevoTurno.fecha}T${nuevoTurno.hora}`);
  const nuevaFechaHoraFin = new Date(
    nuevaFechaHoraInicio.getTime() + duracionMinutos * 60000
  );

  const conflicto = turnos.find(t => {

    if (turnoEdit && t._id === turnoEdit._id) return false;
    if (t.medicoId !== nuevoTurno.medicoId) return false;
    if (t.fecha !== nuevoTurno.fecha) return false;

    const turnoExistenteInicio = new Date(`${t.fecha}T${t.hora}`);
    const turnoExistenteFin = new Date(
      turnoExistenteInicio.getTime() + duracionMinutos * 60000
    );

    return (
      nuevaFechaHoraInicio < turnoExistenteFin &&
      nuevaFechaHoraFin > turnoExistenteInicio
    );
  });

  if (!conflicto) return null;

  const inicio = new Date(`${conflicto.fecha}T${conflicto.hora}`);
  const fin = new Date(inicio.getTime() + duracionMinutos * 60000);

  return {
    ...conflicto,
    horaFin: fin.toTimeString().slice(0, 5)
  };
};

export const validarFechaAtrasada = (fecha, hora) => {

  const fechaHoraTurno = new Date(`${fecha}T${hora}:00`);
  const ahora = new Date();

  return fechaHoraTurno <= ahora;
};


export const validarTurnoCompleto = (
  turnos,
  nuevoTurno,
  turnoEdit = null
) => {

  if (validarFinDeSemana(nuevoTurno.fecha)) {
    return "La clínica no atiende fines de semana.";
  }

  if (validarFechaAtrasada(nuevoTurno.fecha, nuevoTurno.hora)) {
    return "No se pueden crear turnos en horarios que ya pasaron.";
  }

  if (
    horarioLaboral(
      nuevoTurno.fecha,
      nuevoTurno.hora
    )
  ) {
    return "El turno está fuera del horario laboral (08:00 - 18:00).";
  }

  if (validarTurnoDuplicado(turnos, nuevoTurno, turnoEdit)) {
    return "Ese médico ya tiene un turno en ese mismo horario.";
  }

  const conflicto = validarSuperposicion(turnos, nuevoTurno, turnoEdit);

  if (conflicto) {
    return `El médico ya tiene un turno de ${conflicto.hora} a ${conflicto.horaFin}.`;
  }
  
  return null;
};
