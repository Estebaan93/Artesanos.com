-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-07-2025 a las 00:44:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `artesanos`
--
CREATE DATABASE IF NOT EXISTS `artesanos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `artesanos`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id_actividad` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tarea` enum('pendiente','revisar') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `album`
--

CREATE TABLE `album` (
  `id_album` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(250) NOT NULL,
  `fecha` date NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `album`
--

INSERT INTO `album` (`id_album`, `id_usuario`, `titulo`, `fecha`, `estado`) VALUES
(89, 12, 'Acuarela', '2025-07-08', 1),
(90, 12, 'Carpinteria tallado', '2025-07-08', 1),
(91, 11, 'Alfareria expo', '2025-07-08', 1),
(93, 12, 'Macrame', '2025-07-10', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `album_imagen`
--

CREATE TABLE `album_imagen` (
  `id_album` int(11) NOT NULL,
  `id_imagen` int(11) NOT NULL,
  `fecha_agregado` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `album_imagen`
--

INSERT INTO `album_imagen` (`id_album`, `id_imagen`, `fecha_agregado`) VALUES
(89, 33, '2025-07-08'),
(89, 34, '2025-07-08'),
(89, 35, '2025-07-08'),
(90, 36, '2025-07-08'),
(90, 37, '2025-07-08'),
(90, 38, '2025-07-08'),
(91, 39, '2025-07-08'),
(91, 41, '2025-07-08'),
(91, 44, '2025-07-09'),
(91, 51, '2025-07-12'),
(93, 49, '2025-07-10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `id_amigo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `amigo_id` int(11) NOT NULL,
  `nivel` enum('mejores_amigos') NOT NULL DEFAULT 'mejores_amigos',
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `amigos`
--

INSERT INTO `amigos` (`id_amigo`, `id_usuario`, `amigo_id`, `nivel`, `estado`) VALUES
(64, 11, 12, 'mejores_amigos', 1),
(65, 10, 12, 'mejores_amigos', 1),
(66, 14, 11, 'mejores_amigos', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_album` int(11) NOT NULL,
  `id_comentario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id_comentario` int(11) NOT NULL,
  `id_imagen` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id_comentario`, `id_imagen`, `id_usuario`, `descripcion`) VALUES
(21, 37, 11, 'trabajo soñado'),
(22, 33, 11, 'recuerdo de primavera'),
(23, 34, 11, 'Obra que gano premio globo de oro'),
(24, 36, 11, 'hermoso'),
(25, 37, 11, 'Presente en la expo 2025');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `etiqueta`
--

CREATE TABLE `etiqueta` (
  `id_etiqueta` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `etiqueta`
--

INSERT INTO `etiqueta` (`id_etiqueta`, `nombre`) VALUES
(1, 'acrílico'),
(2, 'acuarela'),
(7, 'bordado'),
(5, 'cerámica'),
(9, 'digital'),
(4, 'macramé'),
(8, 'madera'),
(3, 'óleo'),
(6, 'reciclado'),
(10, 'tela');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id_evento` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_evento` date NOT NULL,
  `lugar` varchar(255) NOT NULL,
  `horario` varchar(100) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `publicado` tinyint(1) DEFAULT 1,
  `id_usuario_creador` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `requiere_login` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id_evento`, `titulo`, `descripcion`, `fecha_evento`, `lugar`, `horario`, `imagen`, `publicado`, `id_usuario_creador`, `created_at`, `requiere_login`) VALUES
(7, 'Tallado en madera', 'Nivel 1', '2025-07-13', 'Upro', '09:00', NULL, 1, 11, '2025-07-12 13:20:42', 0),
(10, 'Expo jarrones', 'Exposicion de jarrones chinos', '2025-07-12', 'Upro', '11:53', NULL, 1, 12, '2025-07-12 14:25:04', 0),
(12, 'Lustrado madera', 'Nivel 2', '2025-08-20', 'Upro', '17:00', NULL, 1, 11, '2025-07-12 22:26:02', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento_usuario`
--

CREATE TABLE `evento_usuario` (
  `id` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `asistira` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `estado` enum('inscripto','cancelado') NOT NULL DEFAULT 'inscripto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evento_usuario`
--

INSERT INTO `evento_usuario` (`id`, `id_evento`, `id_usuario`, `asistira`, `created_at`, `nombre`, `apellido`, `estado`) VALUES
(10, 7, 12, 1, '2025-07-12 13:38:20', 'Jun yi', 'Hoo', 'inscripto'),
(14, 10, NULL, 1, '2025-07-12 14:52:24', 'Pedrito', 'Blanco', 'inscripto'),
(18, 7, NULL, 1, '2025-07-12 16:23:02', 'Pedrito', 'Blanco', 'inscripto'),
(19, 7, NULL, 1, '2025-07-12 21:46:43', 'fernando', 'Lucero', 'inscripto'),
(20, 12, 14, 1, '2025-07-12 22:27:01', 'Susana', 'Hillux', 'inscripto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formacion`
--

CREATE TABLE `formacion` (
  `id_formacion` int(11) NOT NULL,
  `tipo` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formacion`
--

INSERT INTO `formacion` (`id_formacion`, `tipo`) VALUES
(7, 'Carpintería'),
(8, 'Alfarería'),
(9, 'Tejido'),
(10, 'Joyería artesanal'),
(11, 'Cesteria'),
(12, 'Talabarteria'),
(13, 'Bordado'),
(14, 'Vidrio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

CREATE TABLE `imagen` (
  `id_imagen` int(11) NOT NULL,
  `imagen` varchar(500) NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `visibilidad` enum('personal','mejores_amigos','publico','personalizada') DEFAULT 'personal',
  `id_album` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagen`
--

INSERT INTO `imagen` (`id_imagen`, `imagen`, `titulo`, `fecha`, `visibilidad`, `id_album`, `estado`) VALUES
(33, 'https://i.etsystatic.com/20809018/r/il/7e6296/3410002070/il_570xN.3410002070_ivbi.jpg', 'Acuarela 2025', '2025-07-08', 'mejores_amigos', 89, 1),
(34, 'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/82/86/6e.jpg', 'Venecia del 60', '2025-07-08', 'mejores_amigos', 89, 1),
(35, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6wREgtertrydfrwz1Un7vhvEqiPhQoVk9OQ&s', 'Invierno', '2025-07-08', 'personal', 89, 1),
(36, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXZVr7Faa-_bou8_WJCjKPLAoJGFHpv_nkeg&s', 'Tallado en madera', '2025-07-08', 'mejores_amigos', 90, 1),
(37, 'https://mott.pe/noticias/wp-content/uploads/2016/01/Dongyang-03.jpg', 'Sueño en madera', '2025-07-08', 'mejores_amigos', 90, 1),
(38, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCK5xuJrnTJCmSQ_Zr0VwGvsIwJta3muVwVg&s', 'Expo madera 25', '2025-07-08', 'publico', 90, 1),
(39, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG_oKVKt4xGVhBpnswCtd7i564OiiPuPttkIVVPIKQUbve21JTQr2LKsizl8kscLl1Zfk&usqp=CAU', 'expo 25', '2025-07-08', 'mejores_amigos', 91, 1),
(41, 'https://hornosdepereruela.wordpress.com/wp-content/uploads/2010/11/interiotnueva6.gif', 'Primeros jarrones de barro', '2025-07-08', 'mejores_amigos', 91, 1),
(44, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6iKiWHi6PcoN0WmLd5ncXjz5Q2FeUaIbsJAnmAOA-Gi12zCRQn2jFOCDViQY3N8O8_Ls&usqp=CAU', 'Coleccion jarrones', '2025-07-09', 'publico', 91, 1),
(49, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8560_kyxn7EtAFCO3l2b9PYCZBLEJhLNBFA&s', 'Mi primera tejido', '2025-07-10', 'publico', 93, 1),
(51, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZpjytq_bClto1FWUwI4FmuhF2eEUEnNBtiA&s', 'segunda clase', '2025-07-12', 'mejores_amigos', 91, 1);

--
-- Disparadores `imagen`
--
DELIMITER $$
CREATE TRIGGER `validar_limite_imagenes` BEFORE INSERT ON `imagen` FOR EACH ROW BEGIN
  DECLARE total_imagenes INT;

  SELECT COUNT(*) INTO total_imagenes FROM imagen WHERE id_album = NEW.id_album;

  IF total_imagenes >= 20 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'El álbum no puede contener más de 20 imágenes.';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen_etiqueta`
--

CREATE TABLE `imagen_etiqueta` (
  `id_imagen` int(11) NOT NULL,
  `id_etiqueta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagen_etiqueta`
--

INSERT INTO `imagen_etiqueta` (`id_imagen`, `id_etiqueta`) VALUES
(33, 2),
(34, 2),
(35, 2),
(36, 8),
(37, 8),
(38, 8),
(39, 5),
(41, 1),
(41, 5),
(44, 5),
(49, 7),
(51, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intereses`
--

CREATE TABLE `intereses` (
  `id_interes` int(11) NOT NULL,
  `tipo` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion_amistad`
--

CREATE TABLE `notificacion_amistad` (
  `id_notificacion` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(20) NOT NULL DEFAULT 'amistad'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificacion_amistad`
--

INSERT INTO `notificacion_amistad` (`id_notificacion`, `id_solicitud`, `id_usuario`, `tipo`) VALUES
(124, 85, 12, 'amistad'),
(126, 86, 12, 'amistad'),
(130, 89, 12, 'amistad'),
(132, 90, 11, 'amistad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion_contenido`
--

CREATE TABLE `notificacion_contenido` (
  `id_notificacion` int(11) NOT NULL,
  `id_comentario` int(11) NOT NULL,
  `leida` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificacion_contenido`
--

INSERT INTO `notificacion_contenido` (`id_notificacion`, `id_comentario`, `leida`) VALUES
(8, 22, 1),
(9, 23, 1),
(10, 24, 1),
(11, 25, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte`
--

CREATE TABLE `reporte` (
  `id_reporte` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_imagen` int(11) DEFAULT NULL,
  `motivo` text NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `estado` enum('pendiente','revisado','descartado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reporte`
--

INSERT INTO `reporte` (`id_reporte`, `id_usuario`, `id_imagen`, `motivo`, `fecha`, `estado`) VALUES
(1, 11, 34, 'imagen no acorde', '2025-07-09 22:42:11', 'descartado'),
(2, 11, 36, 'no me gusta', '2025-07-10 00:36:58', 'pendiente'),
(4, 14, 41, 'fea inapropiada', '2025-07-12 19:34:39', 'revisado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_amistad`
--

CREATE TABLE `solicitud_amistad` (
  `id_solicitud` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_destinatario` int(11) NOT NULL,
  `accion` enum('pendiente','aceptar','rechazar') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitud_amistad`
--

INSERT INTO `solicitud_amistad` (`id_solicitud`, `id_usuario`, `id_destinatario`, `accion`) VALUES
(85, 11, 12, 'aceptar'),
(86, 10, 12, 'aceptar'),
(89, 11, 12, 'aceptar'),
(90, 14, 11, 'aceptar');

--
-- Disparadores `solicitud_amistad`
--
DELIMITER $$
CREATE TRIGGER `actualizar_estado_amistad` AFTER UPDATE ON `solicitud_amistad` FOR EACH ROW BEGIN
  IF NEW.accion = 'aceptar' THEN

    -- Revisar si ya existe la relación de amistad
    IF EXISTS (
      SELECT 1 FROM amigos 
      WHERE id_usuario = NEW.id_usuario AND amigo_id = NEW.id_destinatario
    ) THEN
      -- Si existe pero está inactiva, la activamos
      UPDATE amigos
      SET estado = 1, nivel = 'mejores_amigos'
      WHERE id_usuario = NEW.id_usuario AND amigo_id = NEW.id_destinatario;
    ELSE
      -- Insertar nueva amistad
      INSERT INTO amigos (id_usuario, amigo_id, nivel, estado)
      VALUES (NEW.id_usuario, NEW.id_destinatario, 'mejores_amigos', 1);
    END IF;

  ELSEIF NEW.accion IN ('rechazar', 'cancelar', 'eliminar') THEN
    -- Cambiar estado a 0 para "baja" de amistad
    UPDATE amigos
    SET estado = 0
    WHERE id_usuario = NEW.id_usuario AND amigo_id = NEW.id_destinatario;
  END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_interes`
--

CREATE TABLE `tipo_interes` (
  `id_interes` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `apellido` varchar(60) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `avatarUrl` varchar(250) NOT NULL,
  `fecha` date NOT NULL,
  `estado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `email`, `password`, `avatarUrl`, `fecha`, `estado`) VALUES
(1, 'Juan', 'Pérez', 'juan.perez@example.com', ' probamos123', 'https://example.com/avatar.jpg', '2025-05-01', 1),
(10, 'Samuel', 'Escudero', 'samu25@correo.com', '$2b$10$lWt.ZJDPmONWJ13yLo1/b.yt2C05Nn3PyZDwJ92TfsRMys76Fo5SW', 'https://www.excelsior.com.mx/media/inside-the-note/pictures/2024/12/15/yim_si_wan_2.jpg', '2025-06-13', 1),
(11, 'kim Soo', 'Hyum', 'kim@correo.com', '$2b$10$ieROhAJUI.2f28EX6GCk/enW6zL5CrJ325Wx0zmksV4RkQDZHLgJi', 'https://news.vocofm.com/wp-content/uploads/2025/03/kimm-1024x661.jpeg', '2025-06-13', 1),
(12, 'Jun yi', 'Hoo', 'junyi@correo.com', '$2b$10$gzhBkLVAQ1tBo7.pDaGWMORU0m04YDVUfjZB90Wdwy4kzXgchHOdK', 'https://images.ecestaticos.com/IVJjZo5rjcsATiLQ3mXhIUO92TM=/0x0:800x533/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fd50%2F34b%2F7e6%2Fd5034b7e6c19ca95cbe2fc13d482afe1.jpg', '2025-06-15', 1),
(14, 'Susana', 'Hillux', 'susanita@correo.com', '$2b$10$pB7MF0CFkTlTv9caqR9Ql.tjLuq2Iu.CEgviDCWTOMC3xaJB7g7Eu', 'default.png', '2025-06-17', 1),
(15, 'Susana ', 'Pelegrino', 'susi25@correo.com', '$2b$10$hlTC6XwpZvBCyA535oTjROahtmjaRidK1MCZ63OUzy9GRb6c0ENH6', 'usuario_1749599588915.jpg', '2025-07-05', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_formacion`
--

CREATE TABLE `usuario_formacion` (
  `id_usuario` int(11) NOT NULL,
  `id_formacion` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `institucion` varchar(250) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_formacion`
--

INSERT INTO `usuario_formacion` (`id_usuario`, `id_formacion`, `fecha`, `institucion`, `descripcion`) VALUES
(1, 9, '0000-00-00', 'Taller El Roble', 'Tejido en telar'),
(1, 13, '0000-00-00', 'Escuela de Oficios', 'Bordados chinos'),
(12, 10, '2001-04-12', 'Upro', 'Joyeria Nivel 1'),
(11, 8, '2025-06-25', 'Upro', 'Nivel 1, nivel 2'),
(11, 7, '2025-07-06', 'Upro', 'tallado en madera');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`id_album`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `album_imagen`
--
ALTER TABLE `album_imagen`
  ADD PRIMARY KEY (`id_album`,`id_imagen`),
  ADD KEY `id_imagen` (`id_imagen`);

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`id_amigo`),
  ADD KEY `fk_amigos_usuario` (`id_usuario`),
  ADD KEY `fk_amigos_amigo` (`amigo_id`);

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`),
  ADD KEY `id_album` (`id_album`),
  ADD KEY `id_comentario` (`id_comentario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id_comentario`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_imagen` (`id_imagen`);

--
-- Indices de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  ADD PRIMARY KEY (`id_etiqueta`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `id_usuario_creador` (`id_usuario_creador`);

--
-- Indices de la tabla `evento_usuario`
--
ALTER TABLE `evento_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_evento` (`id_evento`,`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `formacion`
--
ALTER TABLE `formacion`
  ADD PRIMARY KEY (`id_formacion`);

--
-- Indices de la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_album` (`id_album`);

--
-- Indices de la tabla `imagen_etiqueta`
--
ALTER TABLE `imagen_etiqueta`
  ADD PRIMARY KEY (`id_imagen`,`id_etiqueta`),
  ADD KEY `id_etiqueta` (`id_etiqueta`);

--
-- Indices de la tabla `intereses`
--
ALTER TABLE `intereses`
  ADD PRIMARY KEY (`id_interes`);

--
-- Indices de la tabla `notificacion_amistad`
--
ALTER TABLE `notificacion_amistad`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `notificacion_contenido`
--
ALTER TABLE `notificacion_contenido`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_comentario` (`id_comentario`);

--
-- Indices de la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_imagen` (`id_imagen`);

--
-- Indices de la tabla `solicitud_amistad`
--
ALTER TABLE `solicitud_amistad`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_destinatario` (`id_destinatario`);

--
-- Indices de la tabla `tipo_interes`
--
ALTER TABLE `tipo_interes`
  ADD PRIMARY KEY (`id_usuario`,`id_interes`),
  ADD KEY `id_interes` (`id_interes`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `usuario_formacion`
--
ALTER TABLE `usuario_formacion`
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_formacion` (`id_formacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id_actividad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `album`
--
ALTER TABLE `album`
  MODIFY `id_album` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT de la tabla `amigos`
--
ALTER TABLE `amigos`
  MODIFY `id_amigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `etiqueta`
--
ALTER TABLE `etiqueta`
  MODIFY `id_etiqueta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `evento_usuario`
--
ALTER TABLE `evento_usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `formacion`
--
ALTER TABLE `formacion`
  MODIFY `id_formacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `intereses`
--
ALTER TABLE `intereses`
  MODIFY `id_interes` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificacion_amistad`
--
ALTER TABLE `notificacion_amistad`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- AUTO_INCREMENT de la tabla `notificacion_contenido`
--
ALTER TABLE `notificacion_contenido`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `reporte`
--
ALTER TABLE `reporte`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `solicitud_amistad`
--
ALTER TABLE `solicitud_amistad`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `actividades_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `album`
--
ALTER TABLE `album`
  ADD CONSTRAINT `album_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `album_imagen`
--
ALTER TABLE `album_imagen`
  ADD CONSTRAINT `album_imagen_ibfk_1` FOREIGN KEY (`id_album`) REFERENCES `album` (`id_album`) ON DELETE CASCADE,
  ADD CONSTRAINT `album_imagen_ibfk_2` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id_imagen`) ON DELETE CASCADE;

--
-- Filtros para la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD CONSTRAINT `fk_amigos_amigo` FOREIGN KEY (`amigo_id`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `fk_amigos_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`id_album`) REFERENCES `album` (`id_album`),
  ADD CONSTRAINT `auditoria_ibfk_2` FOREIGN KEY (`id_comentario`) REFERENCES `comentarios` (`id_comentario`),
  ADD CONSTRAINT `auditoria_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id_imagen`);

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`id_usuario_creador`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `evento_usuario`
--
ALTER TABLE `evento_usuario`
  ADD CONSTRAINT `evento_usuario_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `eventos` (`id_evento`),
  ADD CONSTRAINT `evento_usuario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD CONSTRAINT `imagen_ibfk_1` FOREIGN KEY (`id_album`) REFERENCES `album` (`id_album`);

--
-- Filtros para la tabla `imagen_etiqueta`
--
ALTER TABLE `imagen_etiqueta`
  ADD CONSTRAINT `imagen_etiqueta_ibfk_1` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id_imagen`) ON DELETE CASCADE,
  ADD CONSTRAINT `imagen_etiqueta_ibfk_2` FOREIGN KEY (`id_etiqueta`) REFERENCES `etiqueta` (`id_etiqueta`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificacion_amistad`
--
ALTER TABLE `notificacion_amistad`
  ADD CONSTRAINT `notificacion_amistad_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud_amistad` (`id_solicitud`),
  ADD CONSTRAINT `notificacion_amistad_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `notificacion_contenido`
--
ALTER TABLE `notificacion_contenido`
  ADD CONSTRAINT `notificacion_contenido_ibfk_1` FOREIGN KEY (`id_comentario`) REFERENCES `comentarios` (`id_comentario`);

--
-- Filtros para la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `reporte_ibfk_2` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id_imagen`);

--
-- Filtros para la tabla `solicitud_amistad`
--
ALTER TABLE `solicitud_amistad`
  ADD CONSTRAINT `solicitud_amistad_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `solicitud_amistad_ibfk_2` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `tipo_interes`
--
ALTER TABLE `tipo_interes`
  ADD CONSTRAINT `tipo_interes_ibfk_1` FOREIGN KEY (`id_interes`) REFERENCES `intereses` (`id_interes`),
  ADD CONSTRAINT `tipo_interes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `usuario_formacion`
--
ALTER TABLE `usuario_formacion`
  ADD CONSTRAINT `usuario_formacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `usuario_formacion_ibfk_2` FOREIGN KEY (`id_formacion`) REFERENCES `formacion` (`id_formacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
