import {
  crearReporte,
  actualizarEstadoReporte,
  obtenerReportesDeUsuario,
  obtenerIdImagenDesdeReporte
} from "../models/reporteModel.js";
import { eliminarImagenPorId } from "../models/imagenModel.js";

export const enviarReporte = async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id_usuario;
    const { id_imagen, motivo } = req.body;

    if (!id_imagen || !motivo) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    await crearReporte({ id_usuario, id_imagen, motivo });
    res.json({ ok: true });
  } catch (error) {
    console.error("Error al enviar reporte:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const verReportesPendientes = async (req, res) => {
  const id_usuario = req.session.usuario.id_usuario;
  const todos = await obtenerReportesDeUsuario(id_usuario);

  // Filtrar solo los pendientes
  const pendientes = todos.filter((r) => r.estado === "pendiente");

  res.render("reportes/misReportes", {
    reportes: pendientes,
    mostrarHistorial: true, // para mostrar botón "Ver historial"
    usuario: req.session.usuario,
  });
};

export const cambiarEstadoReportePost = async (req, res) => {
  const { id_reporte, nuevo_estado } = req.body;
  const estadosValidos = ["pendiente", "revisado", "descartado"];

  if (!estadosValidos.includes(nuevo_estado)) {
    return res.status(400).send("Estado inválido");
  }

  const actualizado = await actualizarEstadoReporte(id_reporte, nuevo_estado);

  // Si fue descartado, desactivar imagen
  if (actualizado && nuevo_estado === "descartado") {
    try {
      const id_imagen = await obtenerIdImagenDesdeReporte(id_reporte);
      if (id_imagen) {
        await eliminarImagenPorId(id_imagen); // tu función ya lista
      }
    } catch (error) {
      console.error("Error al eliminar imagen del reporte descartado:", error);
    }
  }

  if (actualizado) {
    res.redirect("/reportes/mis-reportes");
  } else {
    res.status(404).send("No se pudo actualizar el estado del reporte");
  }
};
export const verHistorialDeReportes = async (req, res) => {
  const id_usuario = req.session.usuario.id_usuario;
  const reportes = await obtenerReportesDeUsuario(id_usuario);

  res.render("reportes/misReportes", {
    reportes,
    mostrarHistorial: false, // no mostrar el botón en historial
    usuario: req.session.usuario,
  });
};
