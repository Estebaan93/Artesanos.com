//controllers/homeController.js
import { obtenerAlbumesPublicosConImagenesYComentarios } from "../models/albumModel.js";
import { obtenerEventosPublicados } from "../models/eventoModel.js"; // Opcional, según tu modelo

export const homeLogueado = async (req, res) => {
  try {
    const usuario = req.session.usuario;
    // 1. Traer eventos destacados (puede ser vacío si no hay eventos aún)
    const ahora = new Date();
    const eventos = await obtenerEventosPublicados(); // o [] si no usás eventos aún
     const eventosFiltrados = eventos
      .filter(evento => !evento.requiere_login || req.session.usuario)
      .map(evento => {
        const fechaEvento = new Date(evento.fecha_evento);
        if (evento.horario) {
          const [hora, minuto] = evento.horario.split(':');
          fechaEvento.setHours(parseInt(hora), parseInt(minuto), 0, 0);
        } else {
          fechaEvento.setHours(0, 0, 0, 0);
        }

        evento.finalizado = fechaEvento <= ahora;

        // 📌 Imagen fija para todos los eventos
        evento.imagen = "/src/img/calendario.jpg";

        return evento;
      });


    // 2. Traer álbumes públicos de la comunidad, EXCLUYENDO los del usuario logueado
    const albumesPublicos = await obtenerAlbumesPublicosConImagenesYComentarios(usuario.id_usuario);

    // 3. Renderizar home
    res.render("logueado/home", {
      usuario,
      eventos: eventosFiltrados,
      albumesPublicos
    });
  } catch (err) {
    console.error("Error en homeLogueado:", err);
    res.status(500).send("Error interno del servidor.");
  }
};
