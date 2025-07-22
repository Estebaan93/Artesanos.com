//public/js/homeIndex.js
document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("form.form-comentar").forEach(form => {
        form.addEventListener("submit", async function(e) {
          e.preventDefault();
          const textarea = form.querySelector("textarea[name=descripcion]");
          const descripcion = textarea.value.trim();
          if (!descripcion) return;
          const action = form.action;

          const res = await fetch(action, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "descripcion=" + encodeURIComponent(descripcion)
          });

          if (res.ok) {
            // Actualizar comentarios (opcional: sacar "Sin comentarios.")
            const ul = form.previousElementSibling;
            if (ul && ul.classList.contains("comentarios")) {
              if (ul.children.length === 1 && ul.children[0].textContent.includes("Sin comentarios")) {
                ul.innerHTML = "";
              }
              // OJO: tu backend solo devuelve ok, si querés nombre del usuario podrías pasarlo desde JS global.
              let usuario = window.usuario?.nombre || "Tú";
              const li = document.createElement("li");
              li.innerHTML = `<strong>${usuario}</strong>: ${descripcion}`;
              ul.prepend(li);
            }
            textarea.value = "";
          } else if (res.status === 401) {
            Swal.fire("Debes estar logueado para comentar");
          } else {
            Swal.fire("No se pudo agregar el comentario");
          }
        });
      });
    });