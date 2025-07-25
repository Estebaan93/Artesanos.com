// controllers/homeController.js
import { obtenerEventosPublicados } from "../models/eventoModel.js";
import {
  obtenerImagenesDeMejoresAmigos,
  obtenerImagenesPublicas
} from "../models/imagenModel.js";
import { obtenerComentariosDeImagen } from "../models/comentarioModel.js";

export const homeLogueado = async (req, res) => {
  try {
    const usuario = req.session.usuario;
    const ahora   = new Date();

    // 1. Eventos destacados
    const eventos = await obtenerEventosPublicados();
    const eventosFiltrados = eventos
      .filter(ev => !ev.requiere_login || usuario)
      .map(ev => {
        const fechaEv = new Date(ev.fecha_evento);
        if (ev.horario) {
          const [h, m] = ev.horario.split(":").map(Number);
          fechaEv.setHours(h, m, 0, 0);
        } else {
          fechaEv.setHours(0, 0, 0, 0);
        }
        ev.finalizado = fechaEv <= ahora;
        ev.imagen = ev.imagen || "/src/img/calendario.jpg";
        return ev;
      });

    // 2. Imágenes de tus mejores amigos
    const rawMejores = await obtenerImagenesDeMejoresAmigos(usuario.id_usuario, 20);
    const imagenesMejoresAmigos = await Promise.all(
      rawMejores.map(async img => {
        const comentarios = await obtenerComentariosDeImagen(img.id_imagen);
        return {
          ...img,
          comentarios,
          fechaFormateada: new Date(img.fecha_subida).toLocaleDateString("es-AR", {
            day:   "2-digit",
            month: "2-digit",
            year:  "numeric"
          })
        };
      })
    );

    // 3. Imágenes públicas de la comunidad
    const rawPublicas = await obtenerImagenesPublicas(50);
    const imagenesPublicas = await Promise.all(
      rawPublicas.map(async img => {
        const comentarios = await obtenerComentariosDeImagen(img.id_imagen);
        return {
          ...img,
          comentarios,
          fechaFormateada: new Date(img.fecha_subida).toLocaleDateString("es-AR", {
            day:   "2-digit",
            month: "2-digit",
            year:  "numeric"
          })
        };
      })
    );

    // 4. Renderizar vista
    res.render("logueado/home", {
      usuario,
      eventos: eventosFiltrados,
      imagenesMejoresAmigos,
      imagenesPublicas
    });
  } catch (err) {
    console.error("Error en homeLogueado:", err);
    res.status(500).send("Error interno del servidor.");
  }
};
