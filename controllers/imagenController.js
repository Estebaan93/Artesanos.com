// controllers/imagenController.js
import pool from '../config/db.js';

import { eliminarAlbumPorId } from "../models/albumModel.js";
import { insertarImagen, asociarImagenAlbum, obtenerValoresEnumVisibilidad , obtenerEtiquetas, asociarEtiquetaImagen, eliminarImagenPorId, obtenerImagenPorId} from "../models/imagenModel.js";
import {obtenerComentariosDeImagen} from '../models/comentarioModel.js'

// Mostrar formulario para subir imagen
export const mostrarFormularioSubir = async (req, res) => {
  try {
    const id_album = req.params.id_album;

    const visibilidades = await obtenerValoresEnumVisibilidad();
    const etiquetas = await obtenerEtiquetas(); // traigo etiquet

    // Renderiza
    res.render('obras/nueva', {
      id_album,
      visibilidades,
      etiquetas
    });

  } catch (error) {
    console.error("Error al mostrar el formulario de subida:", error);
    res.status(500).send("Error al mostrar formulario de subida");
  }
  
};

// Procesar subida de imagen
export const procesarSubidaImagen = async (req, res) => {
  try {
    const id_album = req.params.id_album;
    const { titulo, visibilidad, imagen_url, etiquetas } = req.body;
    let imagen = null;

    if (req.file && req.file.filename) {
      imagen = req.file.filename;
    } else if (imagen_url && imagen_url.trim()) {
      imagen = imagen_url.trim();
    }

    if (!imagen) {
      return res.status(400).send("Debe subir un archivo o ingresar una URL.");
    }

    if (!id_album) {
      return res
        .status(400)
        .send("El id_album es obligatorio y no puede ser nulo.");
    }

    // Insertar imagen
    const id_imagen = await insertarImagen({
      imagen,
      titulo,
      visibilidad: visibilidad || "personal",
      id_album,
    });

    // vinculamos a album
    await asociarImagenAlbum(id_album, id_imagen);

    // Normalizar etiquetas a array
    let etiquetasArray = [];
    if (typeof etiquetas === "string") {
      etiquetasArray = [etiquetas];
    } else if (Array.isArray(etiquetas)) {
      etiquetasArray = etiquetas;
    }
    //relacion tablas
    for (const id_etiqueta of etiquetasArray) {
      await asociarEtiquetaImagen(id_imagen, id_etiqueta);
    }

    res.redirect(`/albumes/${id_album}`);
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).send("Error al subir la imagen");
  }
};


export const eliminarImagen = async (req, res) => {
  const id_imagen = req.params.id_imagen;
  const id_usuario = req.session.usuario.id_usuario;

  try {
    // Verificamos que la imagen pertenezca al usuario logueado
    const [rows] = await pool.query(`
      SELECT i.id_imagen FROM imagen i
      JOIN album a ON i.id_album = a.id_album
      WHERE i.id_imagen = ? AND a.id_usuario = ?
    `, [id_imagen, id_usuario]);

    if (rows.length === 0) {
      return res.status(403).send("No tienes permiso para eliminar esta imagen");
    }

    // Llamamos a la función del modelo que hace el borrado lógico
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

//
export const mostrarImagenPorId = async (req, res) => {
  const id_imagen = req.params.id_imagen; // <-- del parámetro, no la sesión
  try {
    const imagen = await obtenerImagenPorId(id_imagen);
    if (!imagen) {
      return res.status(404).send('Imagen no encontrada');
    }

    // Obtener comentarios de la imagen
    const comentarios = await obtenerComentariosDeImagen(id_imagen);

    // Asegúrate que 'imagen' tenga id_album
    const albumId = imagen.id_album;

    // Renderiza la vista con imagen, comentarios y albumId
    res.render('imagenes/ver', { imagen, comentarios, albumId });
  } catch (error) {
    console.error(`Error al obtener imagen: ${error}`);
    res.status(500).send('Error del servidor');
  }
}