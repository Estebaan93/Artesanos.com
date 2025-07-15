import express from 'express';
import { enviarReporte , cambiarEstadoReportePost,  verReportesPendientes, verHistorialDeReportes} from '../controllers/reporteController.js';
const router = express.Router();

router.post('/', enviarReporte);
router.post('/', enviarReporte);
router.get('/mis-reportes', verReportesPendientes); // por defecto solo pendientes
router.get('/mis-reportes/historial', verHistorialDeReportes); // ver todos
router.post('/cambiar-estado', cambiarEstadoReportePost);

export default router;
