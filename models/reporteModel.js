//reportemodel
import pool from '../config/db.js';

export const crearReporte = async ({ id_usuario, id_imagen, motivo }) => {
  await pool.query(`
    INSERT INTO reporte (id_usuario, id_imagen, motivo)
    VALUES (?, ?, ?)
  `, [id_usuario, id_imagen, motivo]);
};


// Obtener reportes de imágenes que pertenecen a un usuario
export const obtenerReportesDeUsuario = async (id_usuario) => {
  const [rows] = await pool.query(`
    SELECT r.id_reporte, r.motivo, r.estado, r.fecha,
           i.titulo AS titulo_imagen, i.imagen, i.id_imagen
    FROM reporte r
    JOIN imagen i ON r.id_imagen = i.id_imagen
    JOIN album a ON i.id_album = a.id_album
    WHERE a.id_usuario = ?
    ORDER BY r.fecha DESC
  `, [id_usuario]);

  return rows;
};


// Actualizar el estado de un reporte
export const actualizarEstadoReporte = async (id_reporte, nuevo_estado) => {
  const [result] = await pool.query(`
    UPDATE reporte SET estado = ? WHERE id_reporte = ?
  `, [nuevo_estado, id_reporte]);

  return result.affectedRows > 0;
};

export const obtenerIdImagenDesdeReporte = async (id_reporte) => {
  const [rows] = await pool.query(
    `SELECT id_imagen FROM reporte WHERE id_reporte = ?`,
    [id_reporte]
  );
  return rows[0]?.id_imagen || null;
};
