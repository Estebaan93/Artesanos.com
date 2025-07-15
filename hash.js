import bcrypt from 'bcryptjs';
import pool from './config/db.js';

const saltRounds = 10;

const actualizarContraseñas = async () => {
  try {
    const [usuarios] = await pool.query('SELECT id_usuario, password FROM usuario');

    for (const usuario of usuarios) {
            // Si la contraseña no está hasheada, la actualizamos
      if (!usuario.password.startsWith('$2a$')) {
        const hashedPassword = await bcrypt.hash(usuario.password, saltRounds);
        await pool.query('UPDATE usuario SET password = ? WHERE id_usuario = ?', [hashedPassword, usuario.id_usuario]);
        console.log(`Contraseña de usuario ${usuario.id_usuario} actualizada`);
      }
    }

    console.log(' Todas las contraseñas han sido encriptadas correctamente.');
  } catch (error) {
    console.error(' Error al actualizar las contraseñas:', error);
  } finally {
        pool.end(); // Cerrar la conexión
      }
    };

// Ejecutar la función
    actualizarContraseñas();
