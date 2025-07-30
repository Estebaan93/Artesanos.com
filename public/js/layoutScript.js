//public/js/layoutScript.js
document.addEventListener("DOMContentLoaded", () => {
  const btn= document.getElementById("scrollTopBtn");
  const modalLogin = document.getElementById("modal-login");
  const modalRegister = document.getElementById("modal-registrarse");
  const btnLogin = document.getElementById("btn-login");
  const btnRegister = document.getElementById("btn-register");
  const btnCloseLogin = document.getElementById("btn-close");
  const btnCloseRegister = document.getElementById("btn-close-reg");
  const overlay = document.getElementById("overlay");

  const loginForm = modalLogin ? modalLogin.querySelector("form") : null;
  const registerForm = document.getElementById("form-registro");

    // -------- BOTÓN SCROLL TO TOP --------
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Abrir modal login + mostrar overlay
  btnLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    modalLogin.style.display = "block";
    overlay.style.display = "block";
  });

  // Cerrar modal login + ocultar overlay
  btnCloseLogin?.addEventListener("click", () => {
    modalLogin.style.display = "none";
    overlay.style.display = "none";
  });

  // Abrir modal registro + mostrar overlay, ocultar login
  btnRegister?.addEventListener("click", () => {
    modalLogin.style.display = "none";
    modalRegister.style.display = "block";
    overlay.style.display = "block";
  });

  // Cerrar modal registro + ocultar overlay
  btnCloseRegister?.addEventListener("click", () => {
    modalRegister.style.display = "none";
    overlay.style.display = "none";
  });

  // Cerrar modales si clickeas sobre el overlay
  overlay?.addEventListener("click", () => {
    if (modalLogin) modalLogin.style.display = "none";
    if (modalRegister) modalRegister.style.display = "none";
    overlay.style.display = "none";
  });

  // -------- LOGIN AJAX --------
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("SUBMIT de registro capturado (solo debería aparecer una vez por envío)");

      const formData = new FormData(loginForm);
      const payload = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          await Swal.fire({
            icon: "success",
            title: "Bienvenido",
            text: "Sesión iniciada correctamente",
            timer: 1500,
            showConfirmButton: false,
          });
          window.location.href = "/home";
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al iniciar sesión",
            text: data.error || "Usuario o contraseña incorrectos",
          });
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: "No se pudo conectar con el servidor",
        });
      }
    });
  }

  // -------- REGISTRO AJAX CON SWEETALERT --------
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);

      try {
        const response = await fetch("/logueado", {
          method: "POST",
          body: formData, // No agregues headers, el navegador los agrega automáticamente
        });

        const text = await response.text();

        try {
          const data = JSON.parse(text);

          if (response.ok) {
            await Swal.fire({
              icon: "success",
              title: "Usuario registrado",
              text: "¡Tu cuenta ha sido creada correctamente!",
              timer: 1500,
              showConfirmButton: false,
            });
            window.location.href = "/home";
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al registrarse",
              text: data.error || "Datos inválidos o usuario ya existente",
            });
          }
        } catch (e) {
          console.error("La respuesta no fue JSON válida:", text);
          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: "El servidor respondió con un formato inesperado",
          });
        }
      } catch (error) {
        console.error("Error al registrar:", error);
        Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: "No se pudo enviar el formulario",
        });
      }
    });
  }

  // -------- PROTECCIÓN DE RUTAS CON JWT --------
  const token = localStorage.getItem("token");
  if (token) {
    fetch("/home", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          alert("Sesión expirada, inicia sesión nuevamente.");
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      })
      .catch((err) => console.error("Error de autenticación:", err));
  }

  // -------- LOGOUT con confirmación --------
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", async (e) => {
      e.preventDefault();
      const result = await Swal.fire({
        title: "¿Cerrar sesión?",
        text: "¿Estás seguro de que deseas cerrar la sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        await Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          showConfirmButton: false,
          timer: 1200,
        });
        window.location.href = "/logout";
      }
    });
  } else {
    console.warn("Botón logout no encontrado en el DOM");
  }
});

//ver amistades-eliminar

document.addEventListener("DOMContentLoaded", () => {
  const btnAmistades = document.getElementById("btn-amistades");
  if (btnAmistades) {
    btnAmistades.addEventListener("click", async (e) => {
      e.preventDefault(); 

      try {
        const res = await fetch("/api/amistades");
        const amigos = await res.json();

        if (!amigos.length) {
          return Swal.fire(
            "Sin amistades",
            "No tenés amigos agregados aún",
            "info"
          );
        }

        const listado = amigos
          .map(
            (amigo) => `
          <li style="margin: 10px 0;">
            <img src="${
              (!amigo.avatarUrl || amigo.avatarUrl === 'default.png')
                ? '/img/perfiles/default.png'
                : amigo.avatarUrl
            }" 
                 style="width: 40px; height: 40px; border-radius: 50%; vertical-align: middle; margin-right: 8px;">
            ${amigo.nombre} ${amigo.apellido}
            <button class="btn-eliminar-amigo" data-id="${
              amigo.id_usuario
            }" style="margin-left: 10px;">❌</button>
          </li>
        `
          )
          .join("");

        Swal.fire({
          title: "Tus amistades",
          html: `<ul style="text-align:left; list-style:none; padding:0;">${listado}</ul>`,
          showConfirmButton: false,
          width: 600,
          didOpen: () => {
            document.querySelectorAll(".btn-eliminar-amigo").forEach((btn) => {
              btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                const confirmacion = await Swal.fire({
                  title: "¿Eliminar esta amistad?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Sí, eliminar",
                  cancelButtonText: "Cancelar",
                });

                if (confirmacion.isConfirmed) {
                  const res = await fetch(`/api/amistades/${id}`, {
                    method: "DELETE",
                  });
                  const data = await res.json();
                  if (res.ok) {
                    Swal.fire("Eliminado", data.mensaje, "success");
                    btn.closest("li").remove();
                  } else {
                    Swal.fire("Error", data.error, "error");
                  }
                }
              });
            });
          },
        });
      } catch (err) {
        console.error("Error al cargar amistades:", err);
        Swal.fire("Error", "No se pudo cargar la lista de amistades", "error");
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.btnInscribirseHome');
  botones.forEach(btn => {
    btn.addEventListener('click', () => {

      if (btn.dataset.finalizado === "1") {
        Swal.fire('Atención', 'La inscripción para este evento ya finalizó.', 'info');
        return;
      }

      const id_evento = btn.dataset.id;
      const titulo = btn.dataset.titulo || 'Evento';
      const rawFecha = btn.dataset.fecha;
      const fecha = rawFecha? new Date(rawFecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'Sin fecha';
      const horario = btn.dataset.horario || 'Sin horario';
      const lugar = btn.dataset.lugar || 'Sin lugar definido';

      // Mostrar modal con detalles antes del formulario
      Swal.fire({
        title: `Inscribirse a "${titulo}"`,
        html: `
          <div style="text-align:left;">
            <p><strong>📅 Fecha:</strong> ${fecha}</p>
            <p><strong>⏰ Horario:</strong> ${horario} hs</p>
            <p><strong>📍 Lugar:</strong> ${lugar}</p>
            <hr style="margin: 10px 0;">
            <input id="nombre" class="swal2-input" placeholder="Nombre">
            <input id="apellido" class="swal2-input" placeholder="Apellido">
            <label style="text-align:left; width:100%; margin-top: 0.5rem; display:flex">
              <input type="checkbox" id="asistire" checked> Confirmo que asistiré
            </label>
          </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
          const nombre = document.getElementById('nombre').value.trim();
          const apellido = document.getElementById('apellido').value.trim();
          const asistire = document.getElementById('asistire').checked ? 1 : 0;

          if (!nombre || !apellido) {
            Swal.showValidationMessage('Todos los campos son obligatorios');
            return false;
          }

          return { id_evento, nombre, apellido, asistire };
        },
        showCancelButton: true,
        confirmButtonText: 'Inscribirme',
        cancelButtonText: 'Cancelar',
      }).then(result => {
        if (result.isConfirmed) {
          fetch('/eventos/inscribirse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.value),
          })
          .then(res => {
            if (!res.ok) {
              return res.json().then(errData => {
                throw new Error(errData.error || 'Error al inscribirse');
              });
            }
            return res.json();
          })
          .then(data => {
            Swal.fire('¡Listo!', data.mensaje || 'Te inscribiste al evento', 'success');
          })
          .catch(err => {
            Swal.fire('Atención', err.message, 'warning');
          });
        }
      });
    });
  });
});
