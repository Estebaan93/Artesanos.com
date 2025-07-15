//models/albumModel.js
import pool from "../config/db.js";

//obtener todos album
export const obtenerAlbumDeUsuario = async (
  id_usuario,
  id_usuario_consultante
) => {
  if (id_usuario === id_usuario_consultante) {
    const [rows] = await pool.query(
      `
      SELECT * FROM album WHERE id_usuario = ? AND estado = 1 ORDER BY fecha DESC
    `,
      [id_usuario]
    );
    return rows;
  } else {
    const [amistad] = await pool.query(
      `
      SELECT estado FROM amigos
      WHERE id_usuario = ? AND amigo_id = ? AND estado = 1
    `,
      [id_usuario_consultante, id_usuario]
    );

    if (amistad.length === 0) {

      return [];
    }
 
    return [
      {
        id_album: 0,
        id_usuario,
        titulo: `Fotos de ${id_usuario}`,
        virtual: true,
      },
    ];
  }
};

//Crear un nuevo album
export const crearAlbum = async ({ id_usuario, titulo }) => {
  const [result] = await pool.query(
    `INSERT INTO album (id_usuario, titulo, fecha) VALUES (?, ?, NOW())`,
    [id_usuario, titulo]
  );
  return result.insertId;
};

export const obtenerAlbumPorId = async (id_album) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT * FROM album WHERE id_album = ? AND estado = 1
    `,
      [id_album]
    );
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Error al obtener álbum:", error);
    throw new Error("No se pudo recuperar el álbum.");
  }
};

export const eliminarAlbumPorId = async (id_album) => {
  const [result] = await pool.query(
    "UPDATE album SET estado = 0 WHERE id_album = ?",
    [id_album]
  );
  return result.affectedRows > 0;
};

export const buscarAlbumesPorTituloOEtiqueta = async (termino) => {
  const [rows] = await pool.query(
    `
    SELECT DISTINCT a.id_album, a.titulo
    FROM album a
    LEFT JOIN imagen i ON i.id_album = a.id_album
    LEFT JOIN imagen_etiqueta ie ON ie.id_imagen = i.id_imagen
    LEFT JOIN etiqueta e ON e.id_etiqueta = ie.id_etiqueta
    WHERE a.titulo LIKE ? OR e.nombre LIKE ? AND a.estado = 1
    ORDER BY a.fecha DESC
    `,
    [`%${termino}%`, `%${termino}%`]
  );
  return rows;
};

export const buscarImagenesPorTituloOEtiqueta = async (termino) => {
  const [rows] = await pool.query(
    `
    SELECT DISTINCT i.id_imagen, i.titulo, i.id_album, i.visibilidad, i.imagen,
           a.id_usuario AS autor_id
    FROM imagen i
    JOIN album a ON a.id_album = i.id_album
    LEFT JOIN imagen_etiqueta ie ON ie.id_imagen = i.id_imagen
    LEFT JOIN etiqueta e ON e.id_etiqueta = ie.id_etiqueta
    WHERE i.titulo LIKE ? OR e.nombre LIKE ? AND a.estado = 1
    ORDER BY i.fecha DESC
    `,
    [`%${termino}%`, `%${termino}%`]
  );
  return rows;
};

//extra PAPELERA

export const obtenerAlbumesEliminados = async (id_usuario) => {
  const [rows] = await pool.query(`
    SELECT * FROM album 
    WHERE id_usuario = ? AND estado = 0
    ORDER BY fecha DESC
  `, [id_usuario]);
  return rows;
};

export const restaurarAlbumPorId = async (id_album) => {
  const [result] = await pool.query(`
    UPDATE album SET estado = 1 WHERE id_album = ?
  `, [id_album]);
  return result.affectedRows > 0;
};