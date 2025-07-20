import { obtenerAlbumesPublicosConImagenesYComentarios } from "../models/albumModel.js";
import { obtenerEventosPublicados } from "../models/eventoModel.js"; // Opcional, según tu modelo

export const homeLogueado = async (req, res) => {
  try {
    const usuario = req.session.usuario;
    // 1. Traer eventos destacados (puede ser vacío si no hay eventos aún)
    const eventos = await obtenerEventosPublicados(); // o [] si no usás eventos aún

    // 2. Traer álbumes públicos de la comunidad, EXCLUYENDO los del usuario logueado
    const albumesPublicos = await obtenerAlbumesPublicosConImagenesYComentarios(usuario.id_usuario);

    // 3. Renderizar home
    res.render("logueado/home", {
      usuario,
      eventos,
      albumesPublicos
    });
  } catch (err) {
    console.error("Error en homeLogueado:", err);
    res.status(500).send("Error interno del servidor.");
  }
};
