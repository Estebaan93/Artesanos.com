document.addEventListener('DOMContentLoaded', () => {
  // CREAR EVENTO
  const btnCrear = document.getElementById("btnCrearEvento");
  if (btnCrear) {
    btnCrear.addEventListener("click", () => {
      Swal.fire({
        title: "Crear nuevo evento",
        html: `
          <input id="titulo" class="swal2-input" placeholder="Título" required>
          <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción" required></textarea>
          <input type="date" id="fecha" class="swal2-input" required>
          <input type="time" id="horario" class="swal2-input" required>
          <input id="lugar" class="swal2-input" placeholder="Lugar" required>
          <label style="text-align:left; width:100%; margin-top: 0.5rem;">
            <input type="checkbox" id="publicado"> Publicar evento
          </label>
          <label style="text-align:left; width:100%; margin-top: 0.5rem;">
            <input type="checkbox" id="requiere_login"> Solo para usuarios registrados
          </label>
        `,
        preConfirm: () => {
          const titulo = document.getElementById("titulo").value.trim();
          const descripcion = document.getElementById("descripcion").value.trim();
          const fecha = document.getElementById("fecha").value;
          const horario = document.getElementById("horario").value;
          const lugar = document.getElementById("lugar").value.trim();
          const publicado = document.getElementById("publicado").checked ? 1 : 0;
          const requiere_login = document.getElementById("requiere_login").checked ? 1 : 0;

          if (!titulo || !descripcion || !fecha || !horario || !lugar) {
            Swal.showValidationMessage("Completa todos los campos obligatorios");
            return false;
          }

          const fechaHoraEvento = new Date(`${fecha}T${horario}`);
          const ahora = new Date();

          if (fechaHoraEvento <= ahora) {
            Swal.showValidationMessage("La fecha y hora del evento deben ser posteriores al momento actual");
            return false;
          }

          return {
            titulo,
            descripcion,
            fecha,
            lugar,
            horario,
            publicado,
            requiere_login,
          };
        },
        showCancelButton: true,
        confirmButtonText: "Registrar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch("/eventos/nuevo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.value),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                Swal.fire("Error", data.error, "error");
              } else {
                Swal.fire("Creado!", "El evento fue creado correctamente.", "success")
                  .then(() => window.location.reload());
              }
            })
            .catch((err) => Swal.fire("Error", err.message, "error"));
        }
      });
    });
  }
  // INSCRIBIRSE A EVENTO
  const botonesInscribirse = document.querySelectorAll('.btnInscribirse');
  botonesInscribirse.forEach(btn => {
    btn.addEventListener('click', () => {
      const idEvento = btn.getAttribute('data-id');

      Swal.fire({
        title: 'Inscribirse al evento',
        html: `
          <input id="nombre" class="swal2-input" placeholder="Nombre " required>
          <input id="apellido" class="swal2-input" placeholder="Apellido" required>
          <label style="text-align:left; width:100%; margin-top: 0.5rem;">
            <input type="checkbox" id="asistire" checked> Confirmo que asistiré
          </label>
        `,
        focusConfirm: false,
        preConfirm: () => {
          const nombre = Swal.getPopup().querySelector('#nombre').value.trim();
          const apellido = Swal.getPopup().querySelector('#apellido').value.trim();
          const asistire = Swal.getPopup().querySelector('#asistire').checked ? 1 : 0;

          if (!nombre) {
            Swal.showValidationMessage('Por favor ingresa tu nombre');
            return false;
          }
          return { id_evento: idEvento, nombre,apellido, asistire };
        },
        showCancelButton: true,
        confirmButtonText: 'Enviar inscripción',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          fetch("/eventos/inscribirse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.value),
          })
            .then((res) => {
              if (!res.ok) {
                return res.json().then((errData) => {
                  if (res.status === 400 && errData.error) {
                    throw new Error(errData.error);
                  } else {
                    throw new Error("Error al inscribirse");
                  }
                });
              }
              return res.json();
            })
            .then((data) => {
              Swal.fire(
                "¡Inscripto!",
                "Tu inscripción fue registrada correctamente.",
                "success"
              );
            })
            .catch((err) => {
              Swal.fire("Atención", err.message, "warning");
            });

        }
      });
    });
  });
});

// Manejar botón cancelar inscripción
  const botonesCancelar = document.querySelectorAll('.btnCancelarInscripcion');
  botonesCancelar.forEach(btn => {
    btn.addEventListener('click', () => {
      const id_evento = btn.dataset.id;

      Swal.fire({
        title: 'Confirmar cancelación',
        text: '¿Estás seguro que querés cancelar tu inscripción?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No',
      }).then(result => {
        if (result.isConfirmed) {
          // Para el cancelado logueado enviamos solo id_evento, el backend usa session para id_usuario
          fetch('/cancelar-inscripcion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_evento }),
          })
          .then(res => {
            if (!res.ok) {
              return res.json().then(data => { throw new Error(data.error || 'Error al cancelar'); });
            }
            return res.json();
          })
          .then(data => {
            Swal.fire('¡Listo!', data.mensaje, 'success').then(() => {
              location.reload(); // Recargar para actualizar estado y botones
            });
          })
          .catch(err => {
            Swal.fire('Error', err.message, 'error');
          });
        }
      });
    });
  });
