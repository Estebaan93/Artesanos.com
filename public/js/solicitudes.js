// public/js/solicitudes.js
document.addEventListener("DOMContentLoaded", () => {
  const formBuscar = document.getElementById("formBuscar");
  const inputBusqueda = document.getElementById("inputBusqueda");

  formBuscar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const termino = inputBusqueda.value.trim();
    if (!termino) {
      Swal.fire({ icon: "warning", title: "Escribí algo para buscar" });
      return;
    }

    try {
      const [resUsuarios, resContenido] = await Promise.all([
        fetch(`/api/usuarios/buscar?nombre=${encodeURIComponent(termino)}`),
        fetch(`/api/buscar/contenido?q=${encodeURIComponent(termino)}`)
      ]);

      if (!resUsuarios.ok || !resContenido.ok) {
        throw new Error("Error al buscar");
      }

      const usuarios = await resUsuarios.json();
      const { albumes, imagenes } = await resContenido.json();

      if (
        (!usuarios || usuarios.length === 0) &&
        (!albumes || albumes.length === 0) &&
        (!imagenes || imagenes.length === 0)
      ) {
        Swal.fire({ icon: "info", title: "No se encontraron resultados" });
        return;
      }

      let html = `<div style="text-align:left;">`;

      // Usuarios
      if (usuarios.length > 0) {
        html += `<h4>👤 Usuarios</h4><ul>`;
        html += usuarios
          .map((u) => {
            const avatar = `
              <img src="${u.avatarUrl || '/img/perfiles/default.png'}"
                   onerror="this.onerror=null; this.src='/img/perfiles/default.png';"
                   alt="Avatar"
                   style="width:40px; height:40px; border-radius:50%; vertical-align:middle; margin-right:8px;">`;

            let contenido = `
              <a href="/usuarios/perfil/${u.id_usuario}" style="text-decoration:none; color:inherit;">
                ${avatar}
                <span style="vertical-align:middle;">
                  ${u.nombre} ${u.apellido} (${u.email})
                </span>
              </a>`;

            if (u.estado === "amigos") {
              contenido += ` <span style="color:green;">✓ Ya son amigos</span>`;
            } else if (u.estado === "pendiente") {
              contenido += ` <span style="color:orange;">⌛ Solicitud pendiente</span>`;
            } else {
              contenido += ` <button class="btn-agregar" data-id="${u.id_usuario}" data-nombre="${u.nombre}">Agregar</button>`;
            }

            return `<li style="margin-bottom: 10px;">${contenido}</li>`;
          })
          .join("");
        html += `</ul>`;
      }

      // Álbumes
      if (albumes.length > 0) {
        html += `<h4>📁 Álbumes</h4><ul>`;
        html += albumes
          .map((a) => {
            if (a.tipo === "espejo") {
              return `<li><a href="/albumes/espejo/${a.id_usuario}">${a.titulo}</a></li>`;
            } else {
              return `<li><a href="/albumes/${a.id_album}">${a.titulo}</a></li>`;
            }
          })
          .join("");
        html += `</ul>`;
      }

      // Imágenes
      if (imagenes.length > 0) {
        html += `<h4>🖼️ Imágenes</h4><ul>`;
        html += imagenes
          .map((i) => {
            if (i.tipo === "espejo") {
              return `<li><a href="/albumes/espejo/${i.id_usuario}">Imagen: ${i.titulo}</a></li>`;
            } else {
              return `<li><a href="/albumes/${i.id_album}">Imagen: ${i.titulo}</a></li>`;
            }
          })
          .join("");
        html += `</ul>`;
      }

      html += `</div>`;

      Swal.fire({
        title: `Resultados de la búsqueda`,
        html,
        width: 600,
        scrollbarPadding: false,
        showConfirmButton: false,
        didOpen: () => {
          const botones = Swal.getPopup().querySelectorAll(".btn-agregar");
          botones.forEach((btn) => {
            btn.addEventListener("click", () => {
              const id = btn.getAttribute("data-id");
              const nombre = btn.getAttribute("data-nombre");
              agregarAmigo(id, nombre);
            });
          });
        }
      });

      function agregarAmigo(id, nombre) {
        Swal.fire({
          title: `¿Querés agregar a ${nombre} como amigo?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, agregar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            fetch("/solicitudes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_destinatario: id })
            })
              .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                  Swal.fire("Error", data.error || "No se pudo enviar", "error");
                } else {
                  Swal.fire("¡Solicitud enviada!", "", "success");
                }
              })
              .catch(() =>
                Swal.fire("Error", "No se pudo conectar con el servidor", "error")
              );
          }
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  });
});
