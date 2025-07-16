//routes/imagenRoutes.js

import express from 'express';
import { uploadObra } from '../middlewares/upload.js';
import { mostrarFormularioSubir, procesarSubidaImagen, eliminarImagen, mostrarImagenPorId } from '../controllers/imagenController.js';

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

export default router;


