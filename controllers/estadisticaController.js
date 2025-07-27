//controllers/estadisticasController.js
import { contarAlbumesUsuario, contarImagenesUsuario, contarComentariosRecibidos, contarReportesRecibidos, contarEventosUsuario} from '../models/estadisticaModel.js';

export const mostrarEstadisticasPerfil = async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id_usuario;
    const [albumes, imagenes, comentarios, reportes, eventos] = await Promise.all([
      contarAlbumesUsuario(id_usuario),
      contarImagenesUsuario(id_usuario),
      contarComentariosRecibidos(id_usuario),
      contarReportesRecibidos(id_usuario),
      contarEventosUsuario(id_usuario)
    ]);
    res.render('logueado/estadisticas', {
      usuario: req.session.usuario,
      albumes,
      imagenes,
      comentarios,
      reportes,
      eventos
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).send('Error al obtener estadísticas');
  }
};
