//public/js/homeIndex.js
document.addEventListener("DOMContentLoaded", () => {
  // ========== Comentarios en imágenes ==========
  document.querySelectorAll("form.form-comentar").forEach(form => {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      const textarea = form.querySelector("textarea[name=descripcion]");
      const descripcion = textarea.value.trim();
      if (!descripcion) return;
      const action = form.action;

      const res = await fetch(action, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "descripcion=" + encodeURIComponent(descripcion)
      });

      if (res.ok) {
        let usuario = "Tú";
        if (window.usuario) {
          usuario = window.usuario.nombre;
          if (window.usuario.apellido) usuario += " " + window.usuario.apellido;
        }
        const ul = form.previousElementSibling;
        if (ul && ul.classList.contains("comentarios")) {
          if (ul.children.length === 1 && ul.children[0].textContent.includes("Sin comentarios")) {
            ul.innerHTML = "";
          }
          const li = document.createElement("li");
          li.innerHTML = `<strong>${usuario}</strong>: ${descripcion}`;
          ul.prepend(li);
        }
        textarea.value = "";
      } else if (res.status === 401) {
        Swal.fire("Debes estar logueado para comentar");
      } else {
        Swal.fire("No se pudo agregar el comentario");
        console.log(res.status);
      }
    });
  });

  // ========== Inscripción a eventos ==========
  document.querySelectorAll(".btnInscribirseHome").forEach(btn => {
    btn.addEventListener("click", function() {
      // Obtener info del evento desde data-*
      const eventoId = btn.dataset.id;
      const eventoTitulo = btn.dataset.titulo || "Evento";
      mostrarModalInscripcion(eventoId, eventoTitulo);
    });
  });

  function mostrarModalInscripcion(eventoId, eventoTitulo) {
    let camposExtra = '';
    if (!window.usuario) {
      // Visitante: pedir nombre y apellido
      camposExtra = `
        <input type="text" name="nombre" placeholder="Nombre" required class="swal2-input mb-1">
        <input type="text" name="apellido" placeholder="Apellido" required class="swal2-input mb-1">
      `;
    } else {
      // Logueado: mostrar nombre tomado del perfil
      camposExtra = `
        <div class="mb-1" style="margin-bottom:7px">
          <b>${window.usuario.nombre} ${window.usuario.apellido || ""}</b> (se usará tu perfil)
        </div>
      `;
    }

    Swal.fire({
      title: `Inscribirse a "${eventoTitulo}"`,
      html: `
        <form id="formInscripcionEvento">
          ${camposExtra}
          <label style="display:flex; align-items:center; gap:7px; margin-top:6px;">
            <input type="checkbox" name="confirmo" required> Confirmo que asistiré al evento
          </label>
          <button type="submit" class="swal2-confirm swal2-styled" style="margin-top:10px;">Inscribirse</button>
        </form>
      `,
      showConfirmButton: false,
      willOpen: () => {
        document.getElementById('formInscripcionEvento').addEventListener('submit', async function(e) {
          e.preventDefault();
          let body = `eventoId=${encodeURIComponent(eventoId)}&confirmo=1`;
          if (!window.usuario) {
            // Tomar datos del visitante
            const nombre = this.nombre.value.trim();
            const apellido = this.apellido.value.trim();
            if (!nombre || !apellido) {
              Swal.showValidationMessage("Completá tu nombre y apellido");
              return;
            }
            body = `nombre=${encodeURIComponent(nombre)}&apellido=${encodeURIComponent(apellido)}&${body}`;
          }
          // Realizá el fetch a la ruta correspondiente
          const res = await fetch("/eventos/inscribirse", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body
          });
          if (res.ok) {
            Swal.fire("¡Inscripción exitosa!", "", "success");
          } else {
            Swal.fire("No se pudo inscribir", "", "error");
          }
        });
      }
    });
  }

});
