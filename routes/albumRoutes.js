//routes/albumRouter.js
import express from 'express';
import { listarAlbumes, mostrarFormularioCrear, crearAlbumPost, verAlbum, eliminarAlbum , verAlbumEspejo, verPapelera , restaurarAlbum} from '../controllers/albumController.js';
import {restaurarImagen, eliminarImagenDefinitivamenteCtrl} from '../controllers/imagenController.js';

const router = express.Router();

router.get('/albumes/papelera', soloLogueados, verPapelera);
router.post('/restaurar/:id_album', soloLogueados, restaurarAlbum);
router.get('/albumes', soloLogueados, listarAlbumes);
router.get('/albumes/nuevo', soloLogueados, mostrarFormularioCrear);
router.post('/albumes', soloLogueados, crearAlbumPost);
router.get('/albumes/espejo/:id_amigo', soloLogueados, verAlbumEspejo);
router.get('/albumes/:id_album', soloLogueados, verAlbum);
router.delete('/albumes/:id_album',soloLogueados, eliminarAlbum)

router.post('/imagenes/:id_imagen/restaurar', soloLogueados, restaurarImagen);
router.post('/imagenes/:id_imagen/eliminar-definitivo', soloLogueados, eliminarImagenDefinitivamenteCtrl);



function soloLogueados(req, res, next) {
  if (!req.session.loggedin) return res.redirect('/');
  next();
}

export default router;
