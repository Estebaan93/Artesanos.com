// models/eventoModel.js
import pool from '../config/db.js';

// Crear un nuevo evento
export const crearEvento = async ({ titulo, descripcion, publicado, fecha, lugar, horario, id_usuario_creador, requiere_login }) => {
  const [result] = await pool.query(
    `INSERT INTO eventos (titulo, descripcion, publicado, fecha_evento, lugar, horario, id_usuario_creador, requiere_login)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [titulo, descripcion, publicado, fecha, lugar, horario, id_usuario_creador, requiere_login]
  );
  return result.insertId;
};

//obtener eventos
export const obtenerEventosPublicados = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM eventos WHERE publicado = 1 ORDER BY fecha_evento DESC`
  );
  return rows;
};



export const obtenerEventoPorId = async (id_evento) => {
  const [rows] = await pool.query('SELECT * FROM eventos WHERE id_evento = ?', [id_evento]);
  return rows[0];
};


export const inscribirAEvento = async (id_evento, id_usuario, nombre, apellido, asistira) => {
  // Buscar inscripción existente, sin importar estado
  let queryBuscar = '';
  let paramsBuscar = [];

  if (id_usuario) {
    queryBuscar = `SELECT * FROM evento_usuario WHERE id_evento = ? AND id_usuario = ?`;
    paramsBuscar = [id_evento, id_usuario];
  } else {
    queryBuscar = `SELECT * FROM evento_usuario WHERE id_evento = ? AND nombre = ? AND apellido = ?`;
    paramsBuscar = [id_evento, nombre, apellido];
  }

  const [rows] = await pool.query(queryBuscar, paramsBuscar);

  if (rows.length > 0) {
    const inscripcion = rows[0];
    if (inscripcion.estado === 'inscripto') {
      throw new Error('Ya estás inscripto a este evento');
    } else {
      // Si está cancelada, actualizo para reinscribir
      const queryUpdate = id_usuario
        ? `UPDATE evento_usuario SET estado = 'inscripto', asistira = ?, nombre = ?, apellido = ? WHERE id_evento = ? AND id_usuario = ?`
        : `UPDATE evento_usuario SET estado = 'inscripto', asistira = ? WHERE id_evento = ? AND nombre = ? AND apellido = ?`;

      const paramsUpdate = id_usuario
        ? [asistira, nombre, apellido, id_evento, id_usuario]
        : [asistira, id_evento, nombre, apellido];

      await pool.query(queryUpdate, paramsUpdate);
      return inscripcion.id; // o id_usuario, o lo que uses como id
    }
  } else {
    // No existe inscripción, inserto nueva
    const queryInsert = id_usuario
      ? `INSERT INTO evento_usuario (id_evento, id_usuario, nombre, apellido, asistira, estado) VALUES (?, ?, ?, ?, ?, 'inscripto')`
      : `INSERT INTO evento_usuario (id_evento, nombre, apellido, asistira, estado) VALUES (?, ?, ?, ?, 'inscripto')`;

    const paramsInsert = id_usuario
      ? [id_evento, id_usuario, nombre, apellido, asistira]
      : [id_evento, nombre, apellido, asistira];

    const [result] = await pool.query(queryInsert, paramsInsert);
    return result.insertId;
  }
};


//cancelar logeado
export const cancelarInscripcion = async (id_evento, id_usuario, nombre, apellido) => {
  let query, params;

  if (id_usuario) {
    query = `UPDATE evento_usuario SET estado = 'cancelado' WHERE id_evento = ? AND id_usuario = ? AND estado = 'inscripto'`;
    params = [id_evento, id_usuario];
  } else {
    query = `UPDATE evento_usuario SET estado = 'cancelado' WHERE id_evento = ? AND nombre = ? AND apellido = ? AND estado = 'inscripto'`;
    params = [id_evento, nombre, apellido];
  }

  const [result] = await pool.query(query, params);
  return result.affectedRows; 
};


// Ver eventos de los usuarios
export const obtenerEventosPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(
    `SELECT e.* FROM evento_usuario eu
     JOIN eventos e ON eu.id_evento = e.id_evento
     WHERE eu.id_usuario = ?`,
    [id_usuario]
  );
  return rows;
};

