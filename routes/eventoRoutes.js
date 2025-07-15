// routes/eventoRoutes.js
import express from 'express';
import { mostrarEventos, registrarInscripcion, crearEventos , cancelarInscripcionEvento} from '../controllers/eventoController.js';

const router = express.Router();


router.get('/eventos',  mostrarEventos);
router.post('/eventos/inscribirse', registrarInscripcion);
router.post('/eventos/nuevo', crearEventos);
router.post('/cancelar-inscripcion', cancelarInscripcionEvento);


export default router;
