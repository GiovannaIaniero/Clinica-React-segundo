export const validarTurnoDuplicado = (turnos, nuevoTurno, turnoEdit = null) => {
  return turnos.some(t => {
    // Si estoy editando, no comparo contra el mismo turno
    if (turnoEdit && t._id === turnoEdit._id) return false;

    return (
      t.medicoId === nuevoTurno.medicoId &&
      t.fecha === nuevoTurno.fecha &&
      t.hora === nuevoTurno.hora
    );
  });
};

export const validarFinDeSemana = (fecha) => {
  const dia = new Date(fecha).getDay();
  return dia === 5 || dia === 6;
};

