// controllers/portafolioController.js
import { obtenerUsuariosConImagenPublica, obtenerAlbumesPublicosPorUsuario, obtenerImagenesPublicasPorAlbum, obtenerImagenesConComentariosPublicosPorAlbum, obtenerAlbumesPublicosConImagenesYComentariosPorUsuario, obtenerTodasLasImagenesPublicasConComentarios } from '../models/portafolioModel.js';
import {obtenerUsuarioPorId} from '../models/usuarioModel.js';
import {obtenerImagenesVisibles} from '../models/imagenModel.js';

export const verPortafolioPublico = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario;
    const usuario = await obtenerUsuarioPorId(id_usuario);
    const albumes = await obtenerAlbumesPublicosConImagenesYComentariosPorUsuario(id_usuario);

    res.render('public/portafolio', { 
      albumes, 
      usuario,
      title: 'Portafolio público' 
    });
  } catch (error) {
    console.error('Error al ver portafolio público:', error);
    res.status(500).send('Error al obtener portafolio público');
  }
};


export const listarPortafoliosPublicos = async (req, res) => {
  try {
    const imagenes = await obtenerTodasLasImagenesPublicasConComentarios();
    res.render('public/explorePublic', { 
      imagenes, 
      title: 'Explorar imagenes publicas' });
  } catch (error) {
    console.error('Error al listar portafolios públicos:', error);
    res.status(500).send('Error al obtener portafolios públicos');
  }
};

export const explorarImagenesPublicas = async (req, res) => {
  try {
    const imagenes = await obtenerTodasLasImagenesPublicasConComentarios();
    res.render('public/explorePublic', {
      imagenes,
      title: 'Explorar imágenes públicas'
    });
  } catch (error) {
    console.error('Error al explorar imágenes públicas:', error);
    res.status(500).send('Error al cargar las imágenes públicas');
  }
};