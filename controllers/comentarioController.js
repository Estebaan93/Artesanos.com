// controllers/comentarioController.js
import { obtenerComentariosDeImagen, agregarComentario } from "../models/comentarioModel.js";
import { emitirNotificacion } from '../index.js';
import { insertarNotificacionContenido } from "../models/notificacionModel.js";
import pool from '../config/db.js';


// Listar comentarios (JSON)
export const listarComentarios = async (req, res) => {
  try {
    const id_imagen = req.params.id_imagen;
    const comentarios = await obtenerComentariosDeImagen(id_imagen);
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: "No se pudieron cargar los comentarios" });
  }
};

// Agregar comentario 
export const crearComentario = async (req, res) => {
  try {
    const id_imagen = req.params.id_imagen;
    const id_usuario = req.session.usuario.id_usuario;
    const { descripcion } = req.body;

    if (!descripcion || !descripcion.trim()) {
      return res.status(400).json({ error: "El comentario no puede estar vacío" });
    }

    // 1. Insertar comentario
    const id_comentario = await agregarComentario({
      id_imagen,
      id_usuario,
      descripcion: descripcion.trim()
    });

    // 2. Insertar notificación al autor de la imagen
    /*await insertarNotificacionContenido({ id_comentario });*/
    const [[{ id_usuario: id_autor }]] = await pool.query(
  'SELECT a.id_usuario FROM imagen i JOIN album a ON i.id_album = a.id_album WHERE i.id_imagen = ?',
  [id_imagen]
);

    // 3. Obtener el dueño de la imagen para notificar
    /*const [[{ id_usuario: id_autor }]] = await pool.query(
      'SELECT a.id_usuario FROM imagen i JOIN album a ON i.id_album = a.id_album WHERE i.id_imagen = ?',
      [id_imagen]
    );*/
    // 3. Solo insertar notificación si el comentarista no es el autor
  if (id_autor !== id_usuario) {
  // Insertar notificación
  await insertarNotificacionContenido({ id_comentario });
  // Emitir push si el autor está conectado
  emitirNotificacion(id_autor, {
    tipo: 'comentario',
    mensaje: `Nuevo comentario en tu imagen`,
    ref_id: id_imagen
  });
}
    
    // 4. Emitir notificación si el autor está conectado
    if (id_autor !== id_usuario) {
      emitirNotificacion(id_autor, {
        tipo: 'comentario',
        mensaje: `Nuevo comentario en tu imagen`,
        ref_id: id_imagen
      });
    }

    res.json({ ok: true, id_comentario });
  } catch (err) {
    console.error('Error en notificación de comentario:', err);
    res.status(500).json({ error: "No se pudo agregar el comentario" });
  }
};