// models/solicitudModel.js
import pool from '../config/db.js';

export const insertarSolicitudAmistad = async ({ id_usuario, id_destinatario, accion }) => {
  const [result] = await pool.query(
    'INSERT INTO solicitud_amistad (id_usuario, id_destinatario, accion) VALUES (?, ?, ?)',
    [id_usuario, id_destinatario, accion]
  );
  return result.insertId;
};

export const actualizarSolicitudAmistadPorId = async ({ id_solicitud, accion }) => {
  const [result] = await pool.query(
    'UPDATE solicitud_amistad SET accion = ? WHERE id_solicitud = ?',
    [accion, id_solicitud]
  );
  return result.affectedRows;
};

export const obtenerUsuariosDeSolicitud = async (id_solicitud) => {
  const [rows] = await pool.query(
    'SELECT id_usuario, id_destinatario FROM solicitud_amistad WHERE id_solicitud = ?',
    [id_solicitud]
  );
  return rows[0];
};

export const obtenerEstadoAmistad = async (id_usuario, id_destinatario) => {
  // Verificamos amistad activa
  const [amistad] = await pool.query(`
    SELECT estado FROM amigos
    WHERE id_amigo = ? AND amigo_id = ? AND estado = 1
  `, [id_usuario, id_destinatario]);

  if (amistad.length > 0) {
    return "amigos";
  }

  // Verificamos si hay solicitud pendiente
  const [solicitud] = await pool.query(`
    SELECT accion FROM solicitud_amistad
    WHERE (id_usuario = ? AND id_destinatario = ?)
       OR (id_usuario = ? AND id_destinatario = ?)
    ORDER BY id_solicitud DESC LIMIT 1
  `, [id_usuario, id_destinatario, id_destinatario, id_usuario]);

  if (solicitud.length > 0) {
    if (solicitud[0].accion === "pendiente") return "pendiente";
  }

  return "ninguno";
};
