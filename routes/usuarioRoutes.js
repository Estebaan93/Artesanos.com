//routes/usuarioRoutes.js

/*import express from 'express';
import { listarUsuarios, mostrarFormulario, crearUsuario, mostrarPerfil, apiBuscarContenido,procesarLogin,  mostrarBuscador, apiBuscarUsuarios } from '../controllers/usuarioController.js';
import { uploadPerfil } from '../middlewares/upload.js';
import {mostrarEstadisticasPerfil} from '../controllers/estadisticaController.js';
import { obtenerAmigosPorUsuario , eliminarAmistad } from '../models/amistadModel.js';
import { mostrarHome } from '../controllers/eventoController.js';

const router = express.Router();
//para eventos


// Ruta principal
router.get('/', (req, res) => {
  res.render('index');
});


// Procesar login
router.post('/login', procesarLogin);

// Registro de usuarios
router.get('/logueado/nuevo', mostrarFormulario); // Muestra el formulario
router.post('/logueado', uploadPerfil.single('img_perfil'), crearUsuario); // Inserta usuario con foto de perfil

// Usuarios logueados (protegidos por sesión)
router.get('/logueado', soloLogueados, listarUsuarios);
router.get('/logueado/:id', soloLogueados, mostrarPerfil);

// Ruta /home solo para usuarios autenticados
router.get('/home', soloLogueados, (req, res) => {
  res.render('logueado/home', {
    title: 'Inicio',
    usuario: req.session.usuario
  });
});

router.get('/usuarios/buscador', soloLogueados, mostrarBuscador);
router.get('/api/usuarios/buscar', soloLogueados, apiBuscarUsuarios);
router.get('/api/buscar/contenido', soloLogueados, apiBuscarContenido);


// Estadisticas (solo logueados)
router.get('/estadisticas',soloLogueados, mostrarEstadisticasPerfil);

// Logout
router.get('/logout', (req, res) => {
  console.log('Se llamó a /logout desde usuarioRoutes');

  req.session.destroy((err) => {
    if (err) {
      console.error(' Error al cerrar la sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }

    console.log(' Sesión cerrada correctamente');
    res.redirect('/');
  });
});

// ver amistades (solo logueados)
router.get('/api/amistades', soloLogueados, async (req, res) => {
  try {
    const idUsuario = req.session.usuario.id_usuario;
    const amigos = await obtenerAmigosPorUsuario(idUsuario);
    res.json(amigos);
  } catch (error) {
    console.error('Error al obtener amistades:', error);
    res.status(500).json({ error: 'Error al obtener amistades' });
  }
});


// Eliminar amistad
router.delete('/api/amistades/:idAmigo', soloLogueados, async (req, res) => {
  try {
    const idUsuario = req.session.usuario.id_usuario;
    const idAmigo = parseInt(req.params.idAmigo);

    await eliminarAmistad(idUsuario, idAmigo);

    res.json({ mensaje: 'Amistad eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar amistad:", error);
    res.status(500).json({ error: "No se pudo eliminar la amistad" });
  }
});

// Middleware para proteger rutas
function soloLogueados(req, res, next) {
  if (!req.session.loggedin) return res.redirect('/');
  next();
}

export default router;   BORRAR CUANDO TODO FUNCIONE PERFECTAMENTE ANTES NOOOOO NO OLVIDARRRRRR*/

import express from 'express';
import { listarUsuarios, mostrarFormulario, crearUsuario, mostrarPerfil, apiBuscarContenido, procesarLogin, mostrarBuscador, apiBuscarUsuarios } from '../controllers/usuarioController.js';
import { uploadPerfil } from '../middlewares/upload.js';
import { mostrarEstadisticasPerfil } from '../controllers/estadisticaController.js';
import { obtenerAmigosPorUsuario, eliminarAmistad } from '../models/amistadModel.js';
import { mostrarHome } from '../controllers/eventoController.js';
import { homeLogueado} from '../controllers/homeController.js';

const router = express.Router();

// Ruta principal, ahora con eventos
router.get('/', mostrarHome);

// Procesar login
router.post('/login', procesarLogin);

// Registro de usuarios
router.get('/logueado/nuevo', mostrarFormulario); // Muestra el formulario
router.post('/logueado', uploadPerfil.single('img_perfil'), crearUsuario); // Inserta usuario con foto de perfil

// Usuarios logueados (protegidos por sesión)
router.get('/logueado', soloLogueados, listarUsuarios);
router.get('/logueado/:id', soloLogueados, mostrarPerfil);

// Ruta /home solo para usuarios autenticados
router.get('/home', soloLogueados, homeLogueado);


router.get('/usuarios/buscador', soloLogueados, mostrarBuscador);
router.get('/api/usuarios/buscar', soloLogueados, apiBuscarUsuarios);
router.get('/api/buscar/contenido', soloLogueados, apiBuscarContenido);

// Estadisticas (solo logueados)
router.get('/estadisticas', soloLogueados, mostrarEstadisticasPerfil);

// Logout
router.get('/logout', (req, res) => {
  console.log('Se llamó a /logout desde usuarioRoutes');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar la sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }
    console.log(' Sesión cerrada correctamente');
    res.redirect('/');
  });
});

// ver amistades (solo logueados)
router.get('/api/amistades', soloLogueados, async (req, res) => {
  try {
    const idUsuario = req.session.usuario.id_usuario;
    const amigos = await obtenerAmigosPorUsuario(idUsuario);
    res.json(amigos);
  } catch (error) {
    console.error('Error al obtener amistades:', error);
    res.status(500).json({ error: 'Error al obtener amistades' });
  }
});

// Eliminar amistad
router.delete('/api/amistades/:idAmigo', soloLogueados, async (req, res) => {
  try {
    const idUsuario = req.session.usuario.id_usuario;
    const idAmigo = parseInt(req.params.idAmigo);
    await eliminarAmistad(idUsuario, idAmigo);
    res.json({ mensaje: 'Amistad eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar amistad:", error);
    res.status(500).json({ error: "No se pudo eliminar la amistad" });
  }
});

// Middleware para proteger rutas
function soloLogueados(req, res, next) {
  if (!req.session.loggedin) return res.redirect('/');
  next();
}

export default router;





