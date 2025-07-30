//controllers/perfilController.js
import {
  obtenerDatosUsuario,
  obtenerFormacionesUsuario,
  obtenerInteresesUsuario,
  actualizarDatosUsuario
} from '../models/perfilModel.js';

import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export const verPerfil = async (req, res) => {
  try {
    const id_usuario = req.session.usuario?.id_usuario;
    if (!id_usuario) return res.redirect('/');

    const usuario = await obtenerDatosUsuario(id_usuario);
    const formaciones = await obtenerFormacionesUsuario(id_usuario);
    const intereses = await obtenerInteresesUsuario(id_usuario);

    res.render('perfil/perfil', {
      usuario,
      formaciones,
      intereses
    });
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
    res.status(500).send('Error al cargar el perfil');
  }
};

export const mostrarEditarPerfil = async (req, res) => {
  try {
    const id_usuario = req.session.usuario?.id_usuario;
    if (!id_usuario) return res.redirect('/');

    const usuario = await obtenerDatosUsuario(id_usuario);
    const formacionesUsuario = await obtenerFormacionesUsuario(id_usuario);

    const opcionesFormacion = [
      'Carpintería',
      'Alfarería',
      'Tejido',
      'Joyería artesanal',
      'Cesteria',
      'Talabarteria',
      'Bordado',
      'Vidrio',
    ];

    res.render('perfil/editarPerfil', {
      usuario,
      opcionesFormacion,
      formacionesUsuario
    });
  } catch (error) {
    console.error('Error al mostrar formulario de edición:', error);
    res.status(500).send('Error al cargar el formulario de edición');
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const id_usuario = req.session.usuario?.id_usuario;
    if (!id_usuario) return res.redirect('/');

    const {
      nombre,
      apellido,
      email,
      passwordActual,
      nuevaPassword,
      confirmarPassword
    } = req.body;

    let formaciones = req.body.formaciones;
    if (typeof formaciones === 'string') {
      try {
        formaciones = JSON.parse(formaciones);
      } catch {
        formaciones = [];
      }
    }
    if (!Array.isArray(formaciones)) formaciones = [];

    const usuarioBD = await obtenerDatosUsuario(id_usuario);
    let passwordHasheada = null;

    // VALIDACIÓN CAMBIO DE CONTRASEÑA
    const actualVal = (passwordActual || '').trim();
    const nuevaVal = (nuevaPassword || '').trim();
    const confirmarVal = (confirmarPassword || '').trim();

    // Solo validar si alguno tiene valor distinto de vacío
    const quiereCambiarPassword = actualVal !== '' || nuevaVal !== '' || confirmarVal !== ''; 

    if (quiereCambiarPassword) {
      if (!actualVal || !nuevaVal || !confirmarVal) {
        return res.status(400).send("Debes completar todos los campos de contraseña.");
      }

      const coincide = await bcrypt.compare(actualVal, usuarioBD.password);
      if (!coincide) {
        return res.status(400).send("La contraseña actual es incorrecta.");
      }

      if (nuevaVal !== confirmarVal) {
        return res.status(400).send("La nueva contraseña y su confirmación no coinciden.");
      }

      if (nuevaVal.length < 3) {
        return res.status(400).send("La nueva contraseña debe tener al menos 3 caracteres.");
      }

      passwordHasheada = await bcrypt.hash(nuevaVal, 10);
    }

    // ACTUALIZAR AVATAR (si se subió uno nuevo)
    let avatarUrlFinal = usuarioBD.avatarUrl;
    const archivoAvatar = req.file;

    if (archivoAvatar) {
      avatarUrlFinal = `/img/perfiles/${archivoAvatar.filename}`;
      if (usuarioBD.avatarUrl && usuarioBD.avatarUrl.startsWith('/img/perfiles/')) {
        const rutaAnterior = path.join('public', usuarioBD.avatarUrl);
        if (fs.existsSync(rutaAnterior)) {
          fs.unlinkSync(rutaAnterior);
        }
      }
    }

    // ARMAR OBJETO DE ACTUALIZACIÓN
    const datosActualizados = {
      nombre,
      apellido,
      email,
      avatarUrl: avatarUrlFinal,
      formaciones
    };

    if (passwordHasheada) {
      datosActualizados.password = passwordHasheada;
    }

    await actualizarDatosUsuario(id_usuario, datosActualizados);

    res.redirect('/perfil');
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).send('Error al actualizar perfil');
  }
};
