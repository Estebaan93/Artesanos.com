//routes/imagenRoutes.js

import express from 'express';
import { uploadObra } from '../middlewares/upload.js';
import { mostrarFormularioSubir, procesarSubidaImagen, eliminarImagen, mostrarImagenPorId } from '../controllers/imagenController.js';
import {agregarComentario} from '../models/comentarioModel.js';

const router = express.Router();

function soloLogueados(req, res, next) {
  if (!req.session.loggedin) return res.redirect('/');
  next();
}

// Formulario para subir imagen a un álbum específico
router.get('/albumes/:id_album/obras/nueva', soloLogueados, mostrarFormularioSubir);

// Procesar subida (archivo o URL)
router.post('/albumes/:id_album/obras', soloLogueados, uploadObra.single('imagen_local'), procesarSubidaImagen);
router.post("/imagenes/:id_imagen/eliminar", eliminarImagen);

//Ver img individual por id (comentario notificacion)
router.get('/imagen/:id_imagen', mostrarImagenPorId);

router.post('/imagen/:id_imagen/comentario', async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ error: "Debes estar logueado para comentar." });
  }
  const { id_imagen } = req.params;
  const { descripcion } = req.body;
  const id_usuario = req.session.usuario.id_usuario;

  await agregarComentario({ id_imagen, id_usuario, descripcion });
  res.redirect('back'); // O como manejes la recarga de la vista
});



export default router;


