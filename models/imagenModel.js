// models/imagenModel.js
import pool from "../config/db.js";
import path from "path";
import fs from "fs";


export const insertarImagen = async ({ imagen, titulo, visibilidad, id_album }) => {
  if (!id_album) throw new Error('El id_album es obligatorio y no puede ser nulo');
  const [result] = await pool.query(
    'INSERT INTO imagen (imagen, titulo, visibilidad, id_album, fecha) VALUES (?, ?, ?, ?, CURDATE())',
    [imagen, titulo, visibilidad, id_album]
  );
  return result.insertId;
};

// Asociar imagen a un album 
export const asociarImagenAlbum = async (id_album, id_imagen) => {
  try {
    const [rows] = await pool.query(
      'SELECT 1 FROM album_imagen WHERE id_album = ? AND id_imagen = ?',
      [id_album, id_imagen]
    );

    if (rows.length === 0) {
      await pool.query(
        'INSERT INTO album_imagen (id_album, id_imagen, fecha_agregado) VALUES (?, ?, CURDATE())',
        [id_album, id_imagen]
      );
    }
  } catch (error) {
    console.error('Error en asociarImagenAlbum:', error);
    throw error;
  }
};

// Obtener todas las imagenes de un album 

export const obtenerImagenesPorAlbum = async (id_album) => {
  const [rows] = await pool.query(`
    SELECT * FROM imagen 
    WHERE id_album = ? AND estado = 1
    ORDER BY fecha_subida DESC
  `, [id_album]);
  return rows;
};

// Obtener una imagen por id 
export const obtenerImagenPorId = async (id_imagen) => {
  const [rows] = await pool.query(
    'SELECT * FROM imagen WHERE id_imagen = ? AND estado = 1',
    [id_imagen]
  );
  return rows[0] || null;
};


export const obtenerImagenesVisibles = async (
  id_album,
  id_usuario_consultante,
  id_usuario_propietario = null
) => {
  let propietario;

  if (id_album && !id_usuario_propietario) {
    const [albumRows] = await pool.query(
      "SELECT id_usuario FROM album WHERE id_album = ?",
      [id_album]
    );
    if (albumRows.length === 0) return [];
    propietario = Number(albumRows[0].id_usuario);
  } else if (id_usuario_propietario) {
    propietario = Number(id_usuario_propietario);
  } else {
    return [];
  }

  const consultante = Number(id_usuario_consultante);
  if (consultante === propietario) {
    const visibilidadesPermitidas = [
      "personal",
      "amigos",
      "mejores_amigos",
      "publico",
      "personalizada",
    ];
    const placeholders = visibilidadesPermitidas.map(() => "?").join(",");
    const [rows] = await pool.query(
      `SELECT DISTINCT i.*
       FROM imagen i
       LEFT JOIN album_imagen ai ON i.id_imagen = ai.id_imagen
       LEFT JOIN album a ON i.id_album = a.id_album
       WHERE a.id_usuario = ?
       AND (${id_album ? "(i.id_album = ? OR ai.id_album = ?)" : "1=1"})
       AND i.estado = 1
       AND i.visibilidad IN (${placeholders})
       ORDER BY i.fecha DESC`,
      id_album
        ? [propietario, id_album, id_album, ...visibilidadesPermitidas]
        : [propietario, ...visibilidadesPermitidas]
    );

    return rows;
  }

  
  const [nivelRows] = await pool.query(
    `SELECT nivel FROM amigos 
     WHERE estado = 1 AND id_usuario = ? AND amigo_id = ?`,
    [propietario, consultante]
  );
  const nivelAmistad = nivelRows.length > 0 ? nivelRows[0].nivel : null;

  let visibilidadesPermitidas = ["publico"];
  if (nivelAmistad === "mejores_amigos") {
    visibilidadesPermitidas.push("amigos", "mejores_amigos", "personalizada");
  } else if (nivelAmistad === "amigos") {
    visibilidadesPermitidas.push("amigos", "personalizada");
  }

  const placeholders = visibilidadesPermitidas.map(() => "?").join(",");

  const [rows] = await pool.query(
    `SELECT DISTINCT i.*
     FROM imagen i
     LEFT JOIN album_imagen ai ON i.id_imagen = ai.id_imagen
     LEFT JOIN album a ON i.id_album = a.id_album
     WHERE a.id_usuario = ?
     AND (${id_album ? "(i.id_album = ? OR ai.id_album = ?)" : "1=1"})
     AND i.visibilidad IN (${placeholders})
     ORDER BY i.fecha DESC`,
    id_album
      ? [propietario, id_album, id_album, ...visibilidadesPermitidas]
      : [propietario, ...visibilidadesPermitidas]
  );

  return rows;
};


export const obtenerImagenesVisiblesPorUsuario = async (id_propietario, id_consultante) => {
  const visibilidadesPermitidas = ["mejores_amigos", "personalizada"];
  const placeholders = visibilidadesPermitidas.map(() => "?").join(",");

  const [rows] = await pool.query(
    `SELECT i.* 
     FROM imagen i
     INNER JOIN album a ON i.id_album = a.id_album
     WHERE a.id_usuario = ?
     AND i.estado = 1 
     AND i.visibilidad IN (${placeholders})
     ORDER BY i.fecha DESC
     LIMIT 20`,
    [id_propietario, ...visibilidadesPermitidas]
  );

  return rows;
};



// Obtener los valores posibles del ENUM 'visibilidad' de la tabla 'imagen'
export const obtenerValoresEnumVisibilidad = async () => {
  const [rows] = await pool.query("SHOW COLUMNS FROM imagen LIKE 'visibilidad'");
  const enumStr = rows[0].Type; 
  const valores = enumStr.match(/enum\((.*)\)/)[1];
  return valores.split(',').map(valor => valor.replace(/'/g, ""));
};


export const obtenerImagenesPorVisibilidad = async (id_usuario, visibilidad) => {
  // Primero obtener todos album
  const [albumes] = await pool.query(
    'SELECT id_album FROM album WHERE id_usuario = ?',
    [id_usuario]
  );
  
  if (albumes.length === 0) return [];
  const ids_albumes = albumes.map(a => a.id_album);
  const [imagenes] = await pool.query(
    `SELECT i.* FROM imagen i
     LEFT JOIN album_imagen ai ON i.id_imagen = ai.id_imagen
     WHERE (i.id_album IN (?) OR ai.id_album IN (?)) AND i.visibilidad = ? AND i.estado = 1`,
    [ids_albumes, ids_albumes, visibilidad]
  );

  return imagenes;
};


export const obtenerPortadaPorAlbum = async (id_album) => {
  const [imagenes] = await pool.query(
    `SELECT imagen FROM imagen 
     WHERE id_album = ? AND estado = 1
     ORDER BY id_imagen ASC 
     LIMIT 1`,
    [id_album]
  );
  if (imagenes.length > 0) {
    return imagenes[0].imagen;  // devuelve el nombre o URL de la imagen
  } else {
    return null;
  }
};

export const obtenerEtiquetas = async () => {
  const [rows] = await pool.query('SELECT * FROM etiqueta');
  return rows;
};

export const asociarEtiquetaImagen = async (id_imagen, id_etiqueta) => {
  await pool.query(
    'INSERT INTO imagen_etiqueta (id_imagen, id_etiqueta) VALUES (?, ?)',
    [id_imagen, id_etiqueta]
  );
};

export const obtenerEtiquetasPorImagen = async (id_imagen) => {
  const [rows] = await pool.query(
    `SELECT e.nombre 
     FROM etiqueta e
     JOIN imagen_etiqueta ie ON e.id_etiqueta = ie.id_etiqueta
     WHERE ie.id_imagen = ?`,
    [id_imagen]
  );
  return rows.map((row) => row.nombre);
};


export const eliminarImagenPorId = async (id_imagen) => {
  const [result] = await pool.query(`
    UPDATE imagen SET estado = 0 WHERE id_imagen = ?
  `, [id_imagen]);
  return result.affectedRows > 0;
};


// verifica que sea el dueño, para los reporters
export const eliminarImagen = async (req, res) => {
  const id_imagen = req.params.id_imagen;
  const id_usuario = req.session.usuario.id_usuario;

  try {
    // Verificamos si la imagen le pertenece al usuario logueado
    const [rows] = await pool.query(`
      SELECT i.id_imagen FROM imagen i
      JOIN album a ON i.id_album = a.id_album
      WHERE i.id_imagen = ? AND a.id_usuario = ?
    `, [id_imagen, id_usuario]);

    if (rows.length === 0) {
      return res.status(403).send("No tienes permiso para eliminar esta imagen");
    }

    const eliminado = await eliminarImagenPorId(id_imagen);
    if (eliminado) {
      res.status(200).send("Imagen eliminada");
    } else {
      res.status(404).send("Imagen no encontrada");
    }

  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).send("Error interno");
  }
};

//Papelera
export const obtenerImagenesEliminadas= async (id_usuario)=>{
  const [rows]= await pool.query(`
    SELECT i.*, a.titulo AS album_titulo
    FROM imagen i
    JOIN album a ON i.id_album = a.id_album
    WHERE a.id_usuario = ? AND i.estado = 0
    ORDER BY i.fecha DESC
    `, [id_usuario]);
    return rows;
};

export const restaurarImagenPorId = async (id_imagen) => {
  const [result] = await pool.query(`
    UPDATE imagen SET estado = 1 WHERE id_imagen = ?
  `, [id_imagen]);
  return result.affectedRows > 0;
};


export const eliminarImagenDefinitivamente = async (id_imagen) => {
  const [rows] = await pool.query('SELECT imagen FROM imagen WHERE id_imagen = ?', [id_imagen]);
  if (rows.length > 0) {
    const nombreArchivo = rows[0].imagen;
    const rutaArchivo = path.join('public', 'img', 'obras', nombreArchivo);
    if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
  }
  await pool.query('DELETE FROM comentarios WHERE id_imagen = ?', [id_imagen]);
  await pool.query('DELETE FROM imagen_etiqueta WHERE id_imagen = ?', [id_imagen]);
  await pool.query('DELETE FROM imagen WHERE id_imagen = ?', [id_imagen]);
  return true;
};

export async function obtenerImagenesDeMejoresAmigos(idUsuarioLogueado, limit = 50) {
  // 1) IDs de amigos activos
  const [rowsAmigos] = await pool.query(
    `SELECT amigo_id
     FROM amigos
     WHERE id_usuario = ? AND estado = 1`,
    [idUsuarioLogueado]
  );
  const idsAmigos = rowsAmigos.map(r => r.amigo_id);
  if (!idsAmigos.length) return [];

  // 2) Solo visibilidad = 'mejores_amigos'
  const [imagenes] = await pool.query(`
    SELECT i.id_imagen, i.imagen AS url, i.titulo, i.fecha AS fecha_subida,
           u.nombre, u.apellido
    FROM imagen i
    JOIN album a   ON a.id_album   = i.id_album
    JOIN usuario u ON u.id_usuario = a.id_usuario
    WHERE i.estado = 1
      AND a.id_usuario IN (?)
      AND i.visibilidad = 'mejores_amigos'
    ORDER BY i.fecha DESC
    LIMIT ?
  `, [idsAmigos, limit]);

  return imagenes;
}

export async function obtenerImagenesPublicas(limit = 50) {
  const [rows] = await pool.query(`
    SELECT i.id_imagen, i.imagen AS url, i.titulo, i.fecha AS fecha_subida,
           u.nombre, u.apellido
    FROM imagen i
    JOIN album a   ON a.id_album   = i.id_album
    JOIN usuario u ON u.id_usuario = a.id_usuario
    WHERE i.estado = 1
      AND i.visibilidad = 'publico'
    ORDER BY i.fecha DESC
    LIMIT ?
  `, [limit]);
  return rows;
}
