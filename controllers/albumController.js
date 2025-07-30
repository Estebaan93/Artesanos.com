import { crearAlbum, obtenerAlbumDeUsuario, obtenerAlbumPorId, eliminarAlbumPorId , obtenerAlbumesEliminados , restaurarAlbumPorId  } from '../models/albumModel.js';
import {obtenerImagenesVisiblesPorUsuario,obtenerImagenesVisibles, obtenerEtiquetasPorImagen, obtenerImagenesEliminadas } from '../models/imagenModel.js';
import { obtenerUsuarioPorId ,  obtenerAmigosPorUsuario  } from '../models/usuarioModel.js';


export const listarAlbumes = async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id_usuario;

    // album propio
    const albumesFisicos = await obtenerAlbumDeUsuario(id_usuario, id_usuario);
    const albumConPortada = await Promise.all(
      albumesFisicos.map(async (album) => {
        const imagenes = await obtenerImagenesVisibles(
          album.id_album,
          id_usuario
        );
        const portada = imagenes.length > 0 ? imagenes[0].imagen : null;
        return { ...album, portada, tipo: "fisico" };
      })
    );

    const amigos = await obtenerAmigosPorUsuario(id_usuario);

    // se crea album espejo
    const albumesEspejo = await Promise.all(
      amigos.map(async (amigo) => {
        const albumEsp = {
          id_album: `esp-${amigo.id_usuario}`, // ID ficticio
          id_usuario: amigo.id_usuario,
          titulo: `${amigo.nombre} ${amigo.apellido}`,
          fecha: new Date(),
          tipo: "espejo",
        };

        const imagenes = await obtenerImagenesVisiblesPorUsuario(
          amigo.id_usuario,
          id_usuario
        );
        const portada = imagenes.length > 0 ? imagenes[0].imagen : null;

        return { ...albumEsp, portada };
      })
    );

    const albumes = [...albumConPortada, ...albumesEspejo];

    res.render("albumes/index", { albumes });
  } catch (error) {
    console.error(`Error al obtener álbumes: ${error}`);
    res.status(500).send("Error al obtener álbumes");
  }
};

// Mostrar formulario
export const mostrarFormularioCrear = (req, res) => {
  res.render("albumes/nuevo");
};

// Crear album (POST)
export const crearAlbumPost = async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id_usuario;
    const { titulo } = req.body;
    await crearAlbum({ id_usuario, titulo });
    res.redirect("/albumes");
  } catch (error) {
    res.status(500).send("Error al crear álbum");
  }
};

export const verAlbum = async (req, res) => {
  try {
    const id_param = req.params.id_album;

    // Redirecciona si es espejo
    if (id_param.startsWith("esp-")) {
      const id_amigo = id_param.split("-")[1];
      return res.redirect(`/albumes/espejo/${id_amigo}`);
    }

    const id_album = parseInt(id_param);
    if (isNaN(id_album)) return res.status(400).send("ID de álbum inválido");

    const id_usuario_consultante = req.session.usuario.id_usuario;

    const album = await obtenerAlbumPorId(id_album);
    if (!album) return res.status(404).send("Álbum no encontrado");

    const imagenes = await obtenerImagenesVisibles(
      id_album,
      id_usuario_consultante
    );
    for (let img of imagenes) {
      img.etiquetas = await obtenerEtiquetasPorImagen(img.id_imagen);
    }

    res.render("albumes/detalle", { 
      album, 
      imagenes,
      esPropietario: album.id_usuario===id_usuario_consultante 
    });
  } catch (error) {
    console.error("Error en verAlbum:", error);
    res.status(500).send("Error al obtener el álbum");
  }
};



export const verAlbumEspejo = async (req, res) => {
  try {
    const id_amigo = parseInt(req.params.id_amigo);
    const id_consultante = req.session.usuario.id_usuario;

    const amigo = await obtenerUsuarioPorId(id_amigo);
    if (!amigo) return res.status(404).send("Usuario no encontrado");

    const imagenes = await obtenerImagenesVisiblesPorUsuario(
      id_amigo,
      id_consultante
    );

    // ⬅️ Agregar etiquetas a cada imagen
    for (let img of imagenes) {
      img.etiquetas = await obtenerEtiquetasPorImagen(img.id_imagen);
    }

    res.render("albumes/albumEspejo", { amigo, imagenes });
  } catch (error) {
    console.error("Error al ver álbum espejo:", error);
    res.status(500).send("Error al generar álbum espejo");
  }
};


export const eliminarAlbum = async (req, res) => {
  try {
    const id_album = req.params.id_album;
    const eliminado = await eliminarAlbumPorId(id_album);
    if (eliminado) {
      res.status(200).send("Álbum eliminado");
    } else {
      res.status(404).send("Álbum no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar álbum");
  }
};

// EXTRA PAPELERA

export const verPapelera = async (req, res) => {
  const id_usuario = req.session.usuario.id_usuario;

  try {
    const albumes = await obtenerAlbumesEliminados(id_usuario);
    const imagenes= await obtenerImagenesEliminadas(id_usuario);
    res.render('albumes/papelera', { albumes, imagenes });
  } catch (error) {
    console.error("Error al cargar la papelera:", error);
    res.status(500).send("Error interno");
  }
};

export const restaurarAlbum = async (req, res) => {
  const id_album = req.params.id_album;
  const restaurado = await restaurarAlbumPorId(id_album);
  if (restaurado) {
    res.status(200).send("Álbum restaurado");
  } else {
    res.status(404).send("Álbum no encontrado");
  }
};