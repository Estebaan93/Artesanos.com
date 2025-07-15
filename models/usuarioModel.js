//models/usuarioModel.js

import pool from "../config/db.js";

//Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuario');
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};


//Insertar un nuevo usuario
export const insertarUsuario = async ({ nombre, apellido, email, password, avatarUrl, estado }) => {
  const [result] = await pool.query(
    `INSERT INTO usuario (nombre, apellido, email, password, avatarUrl,fecha,  estado) VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
    [nombre, apellido, email, password, avatarUrl, estado] 
  );
  return result.insertId;
};



//Eliminar usuario
export const eliminarUsuario = async (id_usuario) => {
  try {
    await pool.query(`DELETE FROM usuario WHERE id_usuario= ?`, [id_usuario]);
    return true;
  } catch (error) {
    console.error(`Error al eliminar usuario: ${error}`)
    throw error;
  }
}

//Actualizar usuario
export const actualizarUsuario = async (id_usuario, datos) => {
  try {
    const { nombre, apellido, email, password, estado, img_perfil } = datos;
    await pool.query(
      `UPDATE usuario SET nombre = ?, apellido = ?, email = ?, password = ?, estado = ?, img_perfil = ? WHERE id_usuario = ?`,
      [nombre, apellido, email, password, estado, img_perfil, id_usuario]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Obtener un usuario por su ID
export const obtenerUsuarioPorId = async (id_usuario) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};


// Obtener usuario por email
export const obtenerUsuarioPorEmail = async (email) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Error al buscar usuario por email:', error);
    throw error;
  }
};



export const obtenerUsuariosExcepto = async (id_usuario) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE id_usuario != ?', [id_usuario]);
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios excepto el actual:', error);
    throw error;
  }
};

//para buscador
export const obtenerUsuariosPorNombre = async (nombre) => {
  try {
    const query = 'SELECT * FROM usuario WHERE nombre LIKE ?';
    const [rows] = await pool.query(query, [`%${nombre}%`]);
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios por nombre:', error);
    throw error;
  }
};

// buscar amistad para traer datos al buscador y alert
export const buscarUsuariosDisponibles = async (idActual, nombre) => {
  const [usuarios] = await pool.query(
    `SELECT id_usuario, nombre, apellido, email, avatarUrl
     FROM usuario
     WHERE id_usuario != ? AND nombre LIKE ?`,
    [idActual, `%${nombre}%`]
  );

  const resultados = await Promise.all(
    usuarios.map(async (u) => {
      // Verificar si el usuario actual YA tiene como amigo al otro (unidireccional)
      const [amistad] = await pool.query(
        `SELECT estado FROM amigos
       WHERE id_usuario = ? AND amigo_id = ? AND estado = 1
       LIMIT 1`,
        [idActual, u.id_usuario]
      );

      if (amistad.length > 0) {
        return { ...u, estado: "amigos" };
      }

      // Verificar si hay una solicitud pendiente entre ambos (en cualquier dirección)
      const [rel] = await pool.query(
        `SELECT accion FROM solicitud_amistad
       WHERE ((id_usuario = ? AND id_destinatario = ?) OR (id_usuario = ? AND id_destinatario = ?))
       ORDER BY id_solicitud DESC
       LIMIT 1`,
        [idActual, u.id_usuario, u.id_usuario, idActual]
      );

      let estado = "ninguno";
      if (rel.length > 0 && rel[0].accion === "pendiente") {
        estado = "pendiente";
      }

      return { ...u, estado };
    })
  );

  return resultados;
};

// Obtener amigos activos de un usuario (para álbumes espejo)
export const obtenerAmigosPorUsuario = async (id_usuario) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.apellido
       FROM amigos a
       JOIN usuario u ON u.id_usuario = a.amigo_id
       WHERE a.id_usuario = ? AND a.estado = 1`,
      [id_usuario]
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener amigos del usuario:', error);
    throw error;
  }
};
