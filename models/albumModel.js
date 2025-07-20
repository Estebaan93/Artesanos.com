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


/*PROBANDO ELIMINAR JUNTO A IMG*/
export const eliminarAlbumPorId = async (id_album) => {
  //Cambia el estado del album
  const [result] = await pool.query(
    "UPDATE album SET estado = 0 WHERE id_album = ?",
    [id_album]
  );

  //Cambiar estado de imágenes de ese álbum
    await pool.query(
    "UPDATE imagen SET estado = 0 WHERE id_album = ?",
    [id_album]
  );

  // Eliminar comentarios y notificaciones asociadas a las imágenes de ese álbum
  // 1. Obtener IDs de las imágenes del álbum
  const [imagenes] = await pool.query(
    "SELECT id_imagen FROM imagen WHERE id_album = ?",
    [id_album]
  );
  const imagenIds = imagenes.map(img => img.id_imagen);
  if (imagenIds.length > 0) {
    // 2. Obtener IDs de los comentarios asociados
    const [comentarios] = await pool.query(
      "SELECT id_comentario FROM comentarios WHERE id_imagen IN (?)",
      [imagenIds]
    );
    const comentarioIds = comentarios.map(c => c.id_comentario);
    if (comentarioIds.length > 0) {
      // 3. Eliminar notificaciones de esos comentarios
      await pool.query(
        "DELETE FROM notificacion_contenido WHERE id_comentario IN (?)",
        [comentarioIds]
      );
      // 4. Eliminar comentarios
      await pool.query(
        "DELETE FROM comentarios WHERE id_comentario IN (?)",
        [comentarioIds]
      );
    }
  }
  return result.affectedRows > 0;
};




export const buscarAlbumesPorTituloOEtiqueta = async (termino) => {
  const [rows] = await pool.query(
    `
    SELECT DISTINCT a.id_album, a.titulo, a.fecha
    FROM album a
    LEFT JOIN imagen i ON i.id_album = a.id_album
    LEFT JOIN imagen_etiqueta ie ON ie.id_imagen = i.id_imagen
    LEFT JOIN etiqueta e ON e.id_etiqueta = ie.id_etiqueta
    WHERE (a.titulo LIKE ? OR e.nombre LIKE ?) AND a.estado = 1
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
           a.id_usuario AS autor_id, i.fecha
    FROM imagen i
    JOIN album a ON a.id_album = i.id_album
    LEFT JOIN imagen_etiqueta ie ON ie.id_imagen = i.id_imagen
    LEFT JOIN etiqueta e ON e.id_etiqueta = ie.id_etiqueta
    WHERE (i.titulo LIKE ? OR e.nombre LIKE ?) AND a.estado = 1
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
  // 1. Restaurar álbum
  const [result] = await pool.query(`
    UPDATE album SET estado = 1 WHERE id_album = ?
  `, [id_album]);

  // 2. Restaurar imágenes contenidas en ese álbum
  await pool.query(
    "UPDATE imagen SET estado = 1 WHERE id_album = ?",
    [id_album]
  );  
  return result.affectedRows > 0;
};

// Devuelve álbumes públicos de otros usuarios, con imágenes públicas y comentarios
export async function obtenerAlbumesPublicosConImagenesYComentarios(id_usuario_actual) {
  // Todos los álbumes activos, menos los del usuario logueado
  const [albumes] = await pool.query(`
    SELECT a.id_album, a.titulo, a.id_usuario AS autor_id, u.nombre AS autor_nombre, u.apellido AS autor_apellido
    FROM album a
    JOIN usuario u ON a.id_usuario = u.id_usuario
    WHERE a.estado = 1 AND a.id_usuario != ?
    ORDER BY a.fecha DESC
    LIMIT 15
  `, [id_usuario_actual]);

  for (const album of albumes) {
    // Imágenes públicas de cada álbum
    const [imagenes] = await pool.query(`
      SELECT i.id_imagen, i.titulo, i.imagen
      FROM imagen i
      WHERE i.id_album = ? AND i.visibilidad = 'publico' AND i.estado = 1
      ORDER BY i.fecha DESC
      LIMIT 5
    `, [album.id_album]);
    // Comentarios de cada imagen
    for (const img of imagenes) {
      const [comentarios] = await pool.query(`
        SELECT c.descripcion, u.nombre AS usuario
        FROM comentarios c
        JOIN usuario u ON c.id_usuario = u.id_usuario
        WHERE c.id_imagen = ?
        ORDER BY c.id_comentario DESC
        LIMIT 5
      `, [img.id_imagen]);
      img.comentarios = comentarios;
    }
    album.imagenes = imagenes;
  }
  return albumes;
}