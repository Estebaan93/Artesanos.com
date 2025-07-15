//models/amistadModel.js
import pool from '../config/db.js';


// obtener amistades para model menu-item amistad
export const obtenerAmigosPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(`
    SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.avatarUrl
    FROM usuario u
    JOIN amigos a ON a.amigo_id = u.id_usuario
    WHERE a.id_usuario = ? AND a.estado = 1
  `, [id_usuario]);

  return rows;
};


//eliminar amistad  del menu item amistad
export const eliminarAmistad = async (id_usuario, id_amigo) => {
  await pool.query(`
    UPDATE amigos 
    SET estado = 0
    WHERE (id_usuario = ? AND amigo_id = ?)
       OR (id_usuario = ? AND amigo_id = ?)
  `, [id_usuario, id_amigo, id_amigo, id_usuario]);
};