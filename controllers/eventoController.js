// controllers/eventoController.js
import {crearEvento, obtenerEventosPublicados, inscribirAEvento, cancelarInscripcion, obtenerEventoPorId, obtenerEventosPorUsuario} from '../models/eventoModel.js';


export const crearEventos = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      publicado,
      fecha,
      lugar,
      horario,
      requiere_login,
    } = req.body;
    if (!req.session.usuario || !req.session.usuario.id_usuario) {
      return res.status(401).json({
        error: "Debes iniciar sesión para crear un evento",
      });
    }

    const id_usuario_creador = req.session.usuario.id_usuario;

    // Validar fecha y hora
    const fechaHoraEvento = new Date(`${fecha}T${horario}`);
    const ahora = new Date();
    if (fechaHoraEvento <= ahora) {
      return res.status(400).json({
        error: "La fecha y hora del evento deben ser posteriores al momento actual",
      });
    }

    // Crear evento
    const id_evento = await crearEvento({
      titulo,
      descripcion,
      publicado,
      fecha,
      lugar,
      horario,
      id_usuario_creador,
      requiere_login,
    });

    res.status(201).json({ mensaje: "Evento creado", id_evento });
  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(500).json({ error: "No se pudo crear el evento" });
  }
};

//mostrar eventos
export const mostrarEventos = async (req, res) => {
  try {
    const eventos = await obtenerEventosPublicados();
    const id_usuario = req.session.usuario?.id_usuario;

    // Si usuario logueado, obtener sus inscripciones para marcar eventos inscriptos
    let eventosUsuario = [];
    if (id_usuario) {
      eventosUsuario = await obtenerEventosPorUsuario(id_usuario);
    }

    // Mapear eventos para agregar propiedad inscripto: true/false
    eventos.forEach(evento => {
      evento.inscripto = eventosUsuario.some(evUser => evUser.id_evento === evento.id_evento);
      
      // calcula evento finalizadp
      const fechaEvento = new Date(evento.fecha_evento);
      if (evento.horario) {
        const [hora, minuto] = evento.horario.split(':');
        fechaEvento.setHours(parseInt(hora), parseInt(minuto), 0, 0);
      } else {
        fechaEvento.setHours(0,0,0,0);
      }
      const ahora = new Date();
      evento.finalizado = fechaEvento <= ahora;
    });

    res.render('evento/listado', { usuario: req.session.usuario, eventos });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).send('Error al obtener eventos');
  }
};


export const registrarInscripcion = async (req, res) => {
  try {
    const { id_evento, nombre, apellido, asistire } = req.body;
    const id_usuario = req.session.usuario?.id_usuario || null;

    const evento = await obtenerEventoPorId(id_evento);

    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Combinar fecha y hora del evento
    const fechaEvento = new Date(evento.fecha_evento);
    const [hora, minuto] = evento.horario.split(":");
    fechaEvento.setHours(parseInt(hora, 10), parseInt(minuto, 10), 0, 0);

    const ahora = new Date();
    if (fechaEvento <= ahora) {
      return res.status(400).json({ error: "No se puede inscribirse a eventos finalizados" });
    }

    // Intentar inscribir; inscribirAEvento lanzará error si ya está inscripto
    await inscribirAEvento(id_evento, id_usuario, nombre, apellido, asistire);

    res.json({ mensaje: "Inscripción registrada correctamente" });
  } catch (error) {
    console.error("Error al inscribirse:", error);
    if (error.message.includes("Ya estás inscripto")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "No se pudo registrar la inscripción" });
  }
};



//  cancelar inscripcion
export const cancelarInscripcionEvento = async (req, res) => {
  try {
    const { id_evento, nombre, apellido } = req.body;
    const id_usuario = req.session.usuario?.id_usuario || null;

    const result = await cancelarInscripcion(id_evento, id_usuario, nombre, apellido);

    if (result > 0) {
      res.json({ mensaje: 'Inscripción cancelada correctamente' });
    } else {
      res.status(400).json({ error: 'No se encontró inscripción activa para cancelar' });
    }
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    res.status(500).json({ error: 'No se pudo cancelar la inscripción' });
  }
};


// mostrar a NO LOGEADOS
export const mostrarHome = async (req, res) => {
  try {
    const eventos = await obtenerEventosPublicados();
    const ahora = new Date();
    const eventosFiltrados = eventos
      .filter(evento => {
        if (evento.requiere_login && !req.session.usuario) {
          return false;
        }
        return true;
      })
      .map(evento => {
        const fechaEvento = new Date(evento.fecha_evento);
        if (evento.horario) {
          const [hora, minuto] = evento.horario.split(':');
          fechaEvento.setHours(parseInt(hora, 10), parseInt(minuto, 10), 0, 0);
        } else {
          fechaEvento.setHours(0, 0, 0, 0);
        }

        evento.finalizado = fechaEvento <= ahora;
        return evento;
      });

    console.log('Eventos filtrados con estado finalizado calculado:', eventosFiltrados);

    res.render('index', {
      usuario: req.session.usuario,
      eventos: eventosFiltrados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la página');
  }
};
