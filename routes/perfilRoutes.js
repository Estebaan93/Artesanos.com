//routes/perfilRoutes.js
import express from 'express';
import { verPerfil, mostrarEditarPerfil, actualizarPerfil } from '../controllers/perfilController.js';
import {uploadPerfil} from '../middlewares/upload.js'

const router = express.Router();

// Ruta para ver el perfil
router.get('/', verPerfil);
// Para editar
router.get('/editar', mostrarEditarPerfil);
// Guardar cambios de perfil y img
router.post('/editar', uploadPerfil.single('avatar'), actualizarPerfil);

export default router;
