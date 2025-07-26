// models/portafolioModel.js
import pool from '../config/db.js';

// Obtener usuarios que tienen al menos una imagen pública
export const obtenerUsuariosConImagenPublica = async () => {
  const [rows] = await pool.query(`
    SELECT DISTINCT u.id_usuario, u.nombre, u.apellido, u.avatarUrl
    FROM usuario u
    JOIN album a ON u.id_usuario = a.id_usuario
    JOIN imagen i ON a.id_album = i.id_album
    WHERE i.visibilidad = 'publico' AND u.estado = 1
  `);
  return rows;
};

/*SELECT i.id_imagen, i.titulo, i.visibilidad, a.id_album, a.id_usuario
FROM imagen i
JOIN album a ON i.id_album = a.id_album
WHERE i.visibilidad = 'publico';*/
/**/

// Obtener álbumes que tienen imágenes públicas para un usuario
export const obtenerAlbumesPublicosPorUsuario = async (id_usuario) => {
  const [rows] = await pool.query(`
    SELECT DISTINCT a.id_album, a.titulo
    FROM album a
    JOIN imagen i ON a.id_album = i.id_album
    WHERE a.id_usuario = ? AND i.visibilidad = 'publico'
  `, [id_usuario]);
  return rows;
};

// Obtener imágenes públicas de un álbum
export const obtenerImagenesPublicasPorAlbum = async (id_album) => {
  const [rows] = await pool.query(`
    SELECT *
    FROM imagen
    WHERE id_album = ? AND visibilidad = 'publico'
  `, [id_album]);
  return rows;
};


export const obtenerImagenesConComentariosPublicosPorAlbum = async (id_album) => {
  const [rows] = await pool.query(`
    SELECT i.id_imagen, i.titulo, i.imagen, i.visibilidad,
           c.descripcion AS comentarios, u.nombre, u.apellido
    FROM imagen i
    LEFT JOIN comentarios c ON i.id_imagen = c.id_imagen
    LEFT JOIN usuario u ON c.id_usuario = u.id_usuario
    WHERE i.id_album = ? AND i.visibilidad = 'publico'
    ORDER BY i.id_imagen DESC, c.id_comentario ASC
  `, [id_album]);

  // Agrupar comentarios por imagen
  const imagenesMap = {};
  for (const row of rows) {
    if (!imagenesMap[row.id_imagen]) {
      imagenesMap[row.id_imagen] = {
        id_imagen: row.id_imagen,
        titulo: row.titulo,
        imagen: row.imagen,
        visibilidad: row.visibilidad,
        comentarios: [],
      };
    }
    if (row.comentario) {
      imagenesMap[row.id_imagen].comentarios.push({
        descripcion: row.comentario,
        nombre: row.nombre,
        apellido: row.apellido
      });
    }
  }

  return Object.values(imagenesMap);
};

export const obtenerTodasLasImagenesPublicasConComentarios = async () => {
  const [imagenes] = await pool.query(`
    SELECT i.id_imagen, i.titulo, i.imagen, i.visibilidad,
           u.id_usuario, u.nombre, u.apellido, u.avatarUrl
    FROM imagen i
    JOIN album a ON i.id_album = a.id_album
    JOIN usuario u ON a.id_usuario = u.id_usuario
    WHERE i.visibilidad = 'publico' AND i.estado = 1 AND a.estado = 1
    ORDER BY i.id_imagen DESC
  `);

  for (const img of imagenes) {
    const [comentarios] = await pool.query(`
      SELECT c.descripcion, u.nombre, u.apellido
      FROM comentarios c
      JOIN usuario u ON c.id_usuario = u.id_usuario
      WHERE c.id_imagen = ?
      ORDER BY c.id_comentario ASC
      LIMIT 3
    `, [img.id_imagen]);

    img.comentarios = comentarios;
  }

  return imagenes;
};

export const obtenerAlbumesPublicosConImagenesYComentariosPorUsuario = async (id_usuario) => {
  const [albumes] = await pool.query(`
    SELECT DISTINCT a.id_album, a.titulo
    FROM album a
    JOIN imagen i ON a.id_album = i.id_album
    WHERE a.estado = 1 AND a.id_usuario = ? AND i.visibilidad = 'publico'
  `, [id_usuario]);

  for (const album of albumes) {
    const [imagenes] = await pool.query(`
      SELECT i.id_imagen, i.titulo, i.imagen
      FROM imagen i
      WHERE i.id_album = ? AND i.visibilidad = 'publico' AND i.estado = 1
      ORDER BY i.id_imagen DESC
    `, [album.id_album]);

    for (const img of imagenes) {
      const [comentarios] = await pool.query(`
        SELECT c.descripcion, u.nombre, u.apellido
        FROM comentarios c
        JOIN usuario u ON c.id_usuario = u.id_usuario
        WHERE c.id_imagen = ?
        ORDER BY c.id_comentario ASC
      `, [img.id_imagen]);

      img.comentarios = comentarios;
    }

    album.imagenes = imagenes;
  }

  return albumes;
};
